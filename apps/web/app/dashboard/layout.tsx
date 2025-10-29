import { ReactNode } from "react";

// Dashboard layout - no authentication required for now
// You can add authentication later if needed
export default function LayoutPrivate({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
