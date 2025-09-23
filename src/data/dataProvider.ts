import qs from "qs";
import {
  DataProvider,
  fetchUtils,
  GetListParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  UpdateManyParams,
  DeleteManyParams,
  RaRecord,
  UpdateManyResult,
  DeleteResult,
} from "react-admin";

type HttpClient = typeof fetchUtils.fetchJson;

/** Map alternate UI names to canonical resource keys */
const resourceAliases: Record<string, string> = {
  "all-users": "users",
  "add ons": "addons",
};

/** Per-resource endpoint overrides (by verb). */
type ResourceConfig = Partial<{
  base: string; // default base for verbs not overridden
  list: string; // collection endpoint for list (no /{id})
  getOne: string; // base for GET /{base}/{id}
  getMany: string; // base for GET /{base}?ids=1&ids=2
  getManyReference: string;
  create: string;
  update: string; // base for PUT /{base}/{id}
  delete: string; // base for DELETE /{base}/{id}
}>;

/** Map RA resource name -> backend paths */
const resourceMap: Record<string, ResourceConfig> = {
  users: {
    list: "user/all-users",
    getOne: "user/profile", // GET /api/v1/user/all-users
    base: "user", // GET/PUT/DELETE /api/v1/user/{id}
  },
  appointments: { base: "appointments" },
  services: { base: "services" },
  business_hours: { base: "business-settings" },
  addons: { base: "addons" },
};

const normalizeResource = (resource: string) =>
  resourceAliases[resource] ?? resource;

const withBase = (apiUrl: string, path: string) =>
  `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

function pathFor(
  resource: string,
  verb:
    | "list"
    | "getOne"
    | "getMany"
    | "getManyReference"
    | "create"
    | "update"
    | "delete"
): string {
  const key = normalizeResource(resource);
  const cfg = resourceMap[key] ?? {};
  return (cfg as any)[verb] ?? cfg.base ?? key;
}

/**
 * Build Spring-friendly query from RA params:
 *  - pagination: ?page=0&size=25
 *  - sort:       ?sort=field,ASC
 *  - filters:
 *      q         -> search
 *      *_gte     -> *From
 *      *_lte     -> *To
 *      others    -> passthrough
 */
function buildQuery(params: GetListParams | GetManyReferenceParams) {
  const { page = 1, perPage = 25 } = params.pagination ?? {
    page: 1,
    perPage: 25,
  };
  const { field = "id", order = "ASC" } = params.sort ?? {
    field: "id",
    order: "ASC",
  };
  const f = (params as GetListParams).filter ?? {};

  const q: Record<string, unknown> = {};

  // full-text -> "search"
  if (typeof f.q === "string" && f.q.trim().length) {
    q.search = f.q;
  }

  // *_gte / *_lte → *From / *To
  for (const [k, v] of Object.entries(f)) {
    if (k.endsWith("_gte")) q[k.replace("_gte", "From")] = v;
    else if (k.endsWith("_lte")) q[k.replace("_lte", "To")] = v;
  }
  // passthrough the rest
  for (const [k, v] of Object.entries(f)) {
    if (k === "q" || k.endsWith("_gte") || k.endsWith("_lte")) continue;
    q[k] = v;
  }

  // Spring paging (0-based)
  q.page = Math.max(0, page - 1);
  q.size = perPage;

  // Spring sort: field,ASC|DESC
  q.sort = `${field},${order}`;

  return q;
}

/** Extract array from Page<T> | {items:[]} | T[] */
function itemsFrom(json: unknown): any[] {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (typeof json === "object" && json !== null) {
    const anyJson = json as any;
    if (Array.isArray(anyJson.content)) return anyJson.content;
    if (Array.isArray(anyJson.items)) return anyJson.items;
  }
  return [];
}

/** Compute total from Page<T> | Content-Range | array length */
function totalFrom(json: unknown, headers: Headers): number {
  if (json && typeof json === "object" && json !== null) {
    const anyJson = json as any;
    if (typeof anyJson.totalElements === "number") return anyJson.totalElements;
    if (typeof anyJson.total === "number") return anyJson.total;
  }
  const cr = headers.get("Content-Range");
  if (cr) {
    const m = cr.match(/\/(\d+)$/);
    if (m) return Number(m[1]);
  }
  if (Array.isArray(json)) return json.length;
  return 0;
}

type Loyalty = { points?: number | null; redeemedPoints?: number | null };

const normalizeRecord = <
  T extends RaRecord & {
    phoneNumber?: string | null;
    loyaltyRecord?: Loyalty | null;
    loyaltyPoints?: number | null; // may appear in list responses; we'll remove it
    redeemedPoints?: number | null; // just in case some summary returns it flat
  }
>(
  r: T
) => {
  // Prefer nested if present; fall back to flat for list responses
  const points = r.loyaltyRecord?.points ?? r.loyaltyPoints ?? 0;

  const redeemed =
    r.loyaltyRecord?.redeemedPoints ?? (r as any).redeemedPoints ?? 0;

  // strip any flat loyaltyPoints so the UI only ever sees the nested shape
  const { ...rest } = r as any;

  return {
    ...rest,
    id: r.id,
    phoneNumber: r.phoneNumber ?? "",
    loyaltyRecord: {
      points,
      redeemedPoints: redeemed,
    },
  } as T & {
    phoneNumber: string;
    loyaltyRecord: Required<Loyalty>;
  };
};

export default function springDataProvider(
  apiUrl: string,
  httpClient: HttpClient = fetchUtils.fetchJson
): DataProvider {
  return {
    async getList(resource, params) {
      const query = buildQuery(params);
      const listPath = pathFor(resource, "list");
      const url = withBase(
        apiUrl,
        `${listPath}?${qs.stringify(query, { arrayFormat: "repeat" })}`
      );
      const { json, headers } = await httpClient(url);
      const rows = itemsFrom(json).map(normalizeRecord);
      const total = totalFrom(json, headers);
      return { data: rows, total };
    },

    async getOne(resource, params: GetOneParams) {
      const base = pathFor(resource, "getOne");
      const url = withBase(apiUrl, `${base}/${params.id}`);
      const { json } = await httpClient(url);
      console.log("[RAW getOne]", url, JSON.parse(JSON.stringify(json)));
      return { data: normalizeRecord(json) };
    },

    async getMany(resource, params: GetManyParams) {
      const base = pathFor(resource, "getMany");
      const query = qs.stringify(
        { ids: params.ids },
        { arrayFormat: "repeat" }
      );
      const url = withBase(apiUrl, `${base}?${query}`);
      const { json } = await httpClient(url);
      const rows = itemsFrom(json).map(normalizeRecord);
      return { data: rows };
    },

    async getManyReference(resource, params: GetManyReferenceParams) {
      const merged: GetManyReferenceParams = {
        ...params,
        filter: { ...(params.filter ?? {}), [params.target]: params.id },
      };
      const query = buildQuery(merged);
      const base = pathFor(resource, "getManyReference");
      const url = withBase(
        apiUrl,
        `${base}?${qs.stringify(query, { arrayFormat: "repeat" })}`
      );
      const { json, headers } = await httpClient(url);
      const rows = itemsFrom(json).map(normalizeRecord);
      const total = totalFrom(json, headers);
      return { data: rows, total };
    },

    async create(resource, params: CreateParams) {
      const base = pathFor(resource, "create");
      const url = withBase(apiUrl, base);
      const body = JSON.stringify(params.data);
      const { json } = await httpClient(url, { method: "POST", body });
      return { data: normalizeRecord(json) };
    },

    async update(resource, params: UpdateParams) {
      const base = pathFor(resource, "update");
      const url = withBase(apiUrl, `${base}/${params.id}`);
      const body = JSON.stringify(params.data);
      console.log("[dataProvider.update] PUT", url, "body:", params.data);
      const { json } = await httpClient(url, { method: "PUT", body });

      return { data: normalizeRecord(json) };
    },

    async updateMany<RecordType extends RaRecord = any>(
      resource: string,
      params: UpdateManyParams<RecordType>
    ): Promise<UpdateManyResult<RecordType>> {
      const base = pathFor(resource, "update");
      const ids = await Promise.all(
        params.ids.map(async (id) => {
          const url = withBase(apiUrl, `${base}/${id}`);
          const body = JSON.stringify(params.data);
          const { json } = await httpClient(url, { method: "PUT", body });
          return json?.id ?? id;
        })
      );
      return { data: ids as any };
    },

    async delete<RecordType extends RaRecord = any>(
      resource: string,
      params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> {
      const base = pathFor(resource, "delete");
      const url = withBase(apiUrl, `${base}/${params.id}`);
      await httpClient(url, { method: "DELETE" });

      // Prefer previousData when RA provides it; else return minimal { id }
      const data = (params as any).previousData ?? ({ id: params.id } as any);
      return { data };
    },

    async deleteMany<RecordType extends RaRecord = any>(
      resource: string,
      params: DeleteManyParams<RecordType>
    ) {
      const base = pathFor(resource, "delete");
      const ids = await Promise.all(
        params.ids.map(async (id) => {
          const url = withBase(apiUrl, `${base}/${id}`);
          await httpClient(url, { method: "DELETE" });
          return id;
        })
      );
      return { data: ids as any };
    },
  };
}
