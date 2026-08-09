import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) throw new Error("VITE_API_URL is not set");

export const api = axios.create({ baseURL, timeout: 15_000 });

type TokenGetter = () => Promise<string | null>;
let getToken: TokenGetter = async () => null;
export const setTokenGetter = (fn: TokenGetter) => {
  getToken = fn;
};

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    const res = error.response;
    if (res) {
      const message =
        res.data?.error?.message ?? `Request failed (${res.status})`;
      return Promise.reject(new ApiError(message, res.status));
    }
    if (error.code === "ECONNABORTED")
      return Promise.reject(new ApiError("Request timed out"));
    return Promise.reject(new ApiError("Could not reach the API"));
  },
);
