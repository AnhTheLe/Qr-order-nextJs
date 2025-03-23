import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = cookies();

  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = payload.data;

    const decodeAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };

    (await cookieStore).set("accessToken", accessToken, {
      path: "/",
      expires: new Date(decodeAccessToken.exp * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    (await cookieStore).set("refreshToken", refreshToken, {
      path: "/",
      expires: new Date(decodeRefreshToken.exp * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({ message: "Internal Server Error", status: 500 });
    }
  }
}
