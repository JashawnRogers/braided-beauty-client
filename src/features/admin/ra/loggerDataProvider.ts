import { DataProvider } from "react-admin";

export default function withLogger(dp: DataProvider): DataProvider {
  const wrap =
    <K extends keyof DataProvider>(k: K) =>
    async (...args: any[]) => {
      const [resource, params] = args;
      console.log(`[dp.${String(k)}]`, { resource, params });
      try {
        const res = await (dp[k] as any)(...args);
        console.log(`[dp.${String(k)}.result]`, res);
        return res;
      } catch (e) {
        console.error(`[dp.${String(k)}.error]`, e);
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
