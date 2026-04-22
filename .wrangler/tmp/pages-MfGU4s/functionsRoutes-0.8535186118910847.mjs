import { onRequestGet as __api_opinet_around_ts_onRequestGet } from "C:\\Coding\\cursor\\ep4-oil\\functions\\api\\opinet\\around.ts"

export const routes = [
    {
      routePath: "/api/opinet/around",
      mountPath: "/api/opinet",
      method: "GET",
      middlewares: [],
      modules: [__api_opinet_around_ts_onRequestGet],
    },
  ]