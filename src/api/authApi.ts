import api from "./axios";

interface LoginPayload {
  userId: string;
  password: string;
}

export const loginUser = async (
  payload: LoginPayload
) => {
  const response = await api.post(
    "/auth/login",
    payload
  );

  return response.data;
};