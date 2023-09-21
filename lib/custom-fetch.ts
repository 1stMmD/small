import { BACKEND_URL } from "@/config/env";

export const custom_fetch = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
) => {
  delete init?.mode;

  return await fetch(
    (BACKEND_URL ?? "") + input,
    init
      ? {
          mode: "cors",
          ...init,
          headers: {
            "Content-Type": "application/json",
            ...init?.headers,
          },
        }
      : undefined,
  );
};
