import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";
import DealEditor from "./DealEditor";

export default function EditDealPage() {
  return (
    <AdminShell>
      <Suspense>
        <DealEditor />
      </Suspense>
    </AdminShell>
  );
}
