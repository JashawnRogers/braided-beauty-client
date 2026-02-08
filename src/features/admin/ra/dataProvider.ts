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
import {
  normalizeTime,
  normalizeDays,
  normalizeIsClosed,
} from "@/features/admin/ra/businessHours";

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
    base: "users",
    list: "users/all-users",
    getOne: "users",
  },
  appointments: {
    base: "appointment",
    list: "appointment/all-appointments",
  },
  services: { base: "service" },
  hours: { base: "hours" },
  addons: { base: "addons" },
  loyaltySettings: { base: "loyalty/settings" },
  "loyalty-settings": {
    base: "loyalty/settings",
    getOne: "loyalty/settings",
    update: "loyalty/settings",
  },
  categories: { base: "category" },
  businessSettings: { base: "business/settings" },
  "business-settings": {
    base: "business/settings",
    getOne: "business/settings",
    update: "business/settings",
  },
  analytics: {
    base: "analytics",
    list: "analytics/monthly",
    getOne: "analytics/all-time",
  },
};

/** Map alternate UI names to canonical resource keys */
const resourceAliases: Record<string, string> = {
  "all-users": "users",
  "add ons": "addons",
  "business hours": "hours",
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

  if (typeof json === "object" && json !== null) {
    const anyJson = json as any;
    if (anyJson.month && anyJson.completedAppointments != null) {
      return [anyJson];
    }
  }

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

const isSingleton = (resource: string) =>
  normalizeResource(resource) === "loyalty-settings" ||
  normalizeResource(resource) === "business-settings";

type Loyalty = { points?: number | null; redeemedPoints?: number | null };

// Resource-aware normalizers
const normalizeUser = <
  T extends RaRecord & {
    phoneNumber?: string | null;
    loyaltyRecord?: Loyalty | null;
    loyaltyPoints?: number | null;
    redeemedPoints?: number | null;
  }
>(
  r: T
) => {
  const points = r.loyaltyRecord?.points ?? r.loyaltyPoints ?? 0;
  const redeemed =
    r.loyaltyRecord?.redeemedPoints ?? (r as any).redeemedPoints ?? 0;

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

const normalizeLoyaltySettings = (r: any) => ({
  id: "singleton",
  programEnabled: !!r.programEnabled,
  earnPerAppointment: r.earnPerAppointment,
  signupBonusPoints: r.signupBonusPoints,
});

const normalizeBusinessSettings = (r: any) => ({
  id: "singleton",
  companyPhoneNumber: r.companyPhoneNumber,
  companyAddress: r.companyAddress,
  companyEmail: r.companyEmail,
  appointmentBufferTime: r.appointmentBufferTime,
});

const normalizeHours = <
  T extends RaRecord & { openTime?: string | null; closeTime?: string | null }
>(
  r: T
) => ({
  ...r,
  closed: normalizeIsClosed(r.closed),
  dayOfWeek: normalizeDays(r.dayOfWeek),
  openTime: normalizeTime(r.openTime),
  closeTime: normalizeTime(r.closeTime),
});

const normalizeRecordFor = (
  resource: string,
  mode: "list" | "raw"
): ((data: any) => any) => {
  const key = normalizeResource(resource);
  if (key === "users") return normalizeUser;
  if (key === "hours" && mode === "list") return normalizeHours;
  if (key === "loyalty-settings") return normalizeLoyaltySettings;
  if (key === "business-settings") return normalizeBusinessSettings;
  return (x: any) => x;
};

export default function springDataProvider(
  apiUrl: string,
  httpClient: typeof fetchUtils.fetchJson = fetchUtils.fetchJson
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
      console.log("[RAW getList]", url, JSON.parse(JSON.stringify(json)));
      const normalize = normalizeRecordFor(resource, "list");
      const rows = itemsFrom(json).map(normalize);
      const total = totalFrom(json, headers);
      return { data: rows, total };
    },

    async getOne(resource, params: GetOneParams) {
      const base = pathFor(resource, "getOne");
      const url = isSingleton(resource)
        ? withBase(apiUrl, base)
        : withBase(apiUrl, `${base}/${params.id}`);

      const normalize = normalizeRecordFor(resource, "raw");
      const { json } = await httpClient(url);
      console.log("[RAW getOne]", url, JSON.parse(JSON.stringify(json)));

      return isSingleton(resource)
        ? { data: normalize({ ...json, id: "singleton" }) }
        : { data: normalize(json) };
    },

    async getMany(resource, params: GetManyParams) {
      const base = pathFor(resource, "getMany");
      const query = qs.stringify(
        { ids: params.ids },
        { arrayFormat: "repeat" }
      );
      const url = withBase(apiUrl, `${base}?${query}`);
      const { json } = await httpClient(url);
      const normalize = normalizeRecordFor(resource, "list");
      const rows = itemsFrom(json).map(normalize);
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
      const normalize = normalizeRecordFor(resource, "list");
      const rows = itemsFrom(json).map(normalize);
      const total = totalFrom(json, headers);
      return { data: rows, total };
    },

    async create(resource, params: CreateParams) {
      const base = pathFor(resource, "create");
      const url = withBase(apiUrl, base);
      const body = JSON.stringify(params.data);
      const { json } = await httpClient(url, { method: "POST", body });
      console.log("[dataProvider.create] POST", url, "body:", params.data);
      const normalize = normalizeRecordFor(resource, "raw");
      return { data: normalize(json) };
    },

    async update(resource, params: UpdateParams) {
      const base = pathFor(resource, "update");
      const url = isSingleton(resource)
        ? withBase(apiUrl, base)
        : withBase(apiUrl, `${base}/${params.id}`);

      const normalize = normalizeRecordFor(resource, "raw");

      const body = isSingleton(resource)
        ? JSON.stringify((({ ...rest }) => rest)(params.data as any))
        : JSON.stringify(params.data);

      console.log("[dataProvider.update] PATCH", url, "body:", params.data);
      const { json } = await httpClient(url, {
        method: "PATCH",
        body,
        headers: { "Content-Type": "application/json" },
      });

      return isSingleton(resource)
        ? { data: normalize({ ...json, id: "singleton" }) }
        : { data: normalize(json) };
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
