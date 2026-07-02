import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getPortfolio } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminPage() {
  const data = await getPortfolio();
  return <AdminDashboard initialData={data} />;
}
