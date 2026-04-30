import { useMutation } from "@tanstack/react-query";
import { usersApi } from "../api/users";
import { useAuthStore } from "../stores/useAuthStore";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  return useMutation({
    mutationFn: ({
      phone,
      password,
      role,
    }: {
      phone: string;
      password: string;
      role: "farmer" | "buyer";
    }) => usersApi.login(phone, password, role),
    onMutate: () => setLoading(true),
    onSuccess: ({ user, token }) => setAuth(user, token),
    onError: () => setLoading(false),
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  return useMutation({
    mutationFn: (data: {
      name: string;
      phone: string;
      password: string;
      role: "farmer" | "buyer";
      district: string;
    }) => usersApi.register(data),
    onMutate: () => setLoading(true),
    onSuccess: ({ user, token }) => setAuth(user, token),
    onError: () => setLoading(false),
  });
};
