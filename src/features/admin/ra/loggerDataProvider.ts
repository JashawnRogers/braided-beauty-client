import { DataProvider } from "react-admin";
import { logger } from "@/lib/logger";

function getRecordId(params: unknown) {
  if (!params || typeof params !== "object") return undefined;
  const id = (params as { id?: unknown }).id;
  return typeof id === "string" || typeof id === "number" ? id : undefined;
}

export default function withLogger(dp: DataProvider): DataProvider {
  const wrap =
    <K extends keyof DataProvider>(k: K) =>
    async (...args: any[]) => {
      const [resource, params] = args;
      try {
        return await (dp[k] as any)(...args);
      } catch (e) {
        logger.error("admin.data_provider.failed", e, {
          operation: String(k),
          resource,
          recordId: getRecordId(params),
        });
        throw e;
      }
    };
  return {
    getList: wrap("getList"),
    getOne: wrap("getOne"),
    getMany: wrap("getMany"),
    getManyReference: wrap("getManyReference"),
    create: wrap("create"),
    update: wrap("update"),
    updateMany: wrap("updateMany"),
    delete: wrap("delete"),
    deleteMany: wrap("deleteMany"),
  };
}
