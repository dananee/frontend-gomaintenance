import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { LoginCredentials } from "../types/auth.types";

export function useLogin() {
  const { login: setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      router.push("/dashboard");
    },
  });
}
