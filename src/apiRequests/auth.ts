import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType } from "@/schemaValidations/auth.schema";
import { log } from "console";

const authLoginRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  slogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post(
      "/api/auth/logout",
      { refreshToken: body.refreshToken },
      {
        baseUrl: "",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    ),
  logout: () => http.post("/api/auth/logout", null, { baseUrl: "" }),  //client gọi đến route handler
};

export default authLoginRequest;
