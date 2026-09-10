import api from "./axios";

export const getDashboard = async () => {
  const response = await api.get("/dashboard/dashboard");

  return response.data;
};