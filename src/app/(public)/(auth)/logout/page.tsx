import { getAccessToken, getRefreshToken } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);

  const searchParams = new URLSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  useEffect(() => {
    if (
      ref.current ||
      !refreshTokenFromUrl ||
      !accessTokenFromUrl ||
      (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshToken()) ||
      (accessTokenFromUrl && accessTokenFromUrl !== getAccessToken())
    ) {
      return;
    }

    ref.current = mutateAsync;

    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/login");
    });
  }, [mutateAsync, router, refreshTokenFromUrl]);

  return <div>Page</div>;
}
