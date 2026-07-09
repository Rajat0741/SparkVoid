import { usePathname, useSearchParams } from "next/navigation";

/** Returns true when the user is on /chat with the temporary=1 query param. */
export function useTemporaryChat(): boolean {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return pathname === "/chat" && searchParams.has("temporary");
}
