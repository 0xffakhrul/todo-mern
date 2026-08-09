import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setTokenGetter } from "@/lib/api-client";

export const useCurrentUser = () => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  return { isLoaded, isSignedIn: !!isSignedIn, userId: userId ?? undefined };
};

export const useAuthBridge = () => {
  const { getToken } = useAuth();
  useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);
};
