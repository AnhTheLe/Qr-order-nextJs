import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const cookieStore = cookies();

  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      { message: "Không nhận được refreshToken" },
      { status: 401 }
    );
  }

  (await cookieStore).delete("accessToken");
  (await cookieStore).delete("refreshToken");
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken,
    });

    const decodeAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodeRefreshToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };

    (await cookieStore).set("accessToken", payload.data.accessToken, {
      path: "/",
      expires: new Date(decodeAccessToken.exp * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    (await cookieStore).set("refreshToken", payload.data.refreshToken, {
      path: "/",
      expires: new Date(decodeRefreshToken.exp * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      { message: error.message ?? "Error" },
      { status: 401 }
    );
  }
}
