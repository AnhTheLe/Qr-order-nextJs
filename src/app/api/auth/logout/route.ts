import authLoginRequest from "@/apiRequests/auth";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const cookieStore = cookies();

  const accessToken = (await cookieStore).get("accessToken")?.value;
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return Response.json(
      { message: "Không nhận được accessToken hoặc refreshToken" },
      { status: 200 }
    );
  }

  (await cookieStore).delete("accessToken");
  (await cookieStore).delete("refreshToken");
  try {
    const result = await authLoginRequest.slogout({
      accessToken,
      refreshToken,
    });

    return Response.json(result.payload, { status: 200 });
  } catch (error) {
    return Response.json({
      message: "Lỗi khi gọi api đến server",
      status: 200,
    });
  }
}
