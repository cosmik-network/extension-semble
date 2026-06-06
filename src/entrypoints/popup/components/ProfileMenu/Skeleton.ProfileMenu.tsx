import { Skeleton } from "@mantine/core";

/**
 * Loading placeholder mirroring {@link ProfileMenu}'s avatar. Reserves the
 * avatar's space so the header doesn't grow (and push the logo down) when
 * the profile loads in.
 */
export function ProfileMenuSkeleton() {
  return <Skeleton height={24} width={24} radius="sm" />;
}
