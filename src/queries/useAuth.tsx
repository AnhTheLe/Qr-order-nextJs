import authLoginRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authLoginRequest.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authLoginRequest.logout,
  });
};
