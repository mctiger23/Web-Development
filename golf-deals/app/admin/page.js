import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Dashboard from "./Dashboard";

export default function AdminPage() {
  return (
    <AdminShell>
      <Suspense>
        <Dashboard />
      </Suspense>
    </AdminShell>
  );
}
