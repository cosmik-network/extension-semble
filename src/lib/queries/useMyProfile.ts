import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

/** The signed-in user's profile. Disabled when no API key is configured. */
export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getMyProfile,
    enabled: !!getApiKey(),
  });
}
