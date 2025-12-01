import { useProfileContext } from "@/components/providers/ProfileProvider";

export function useProfile() {
  return useProfileContext();
}
