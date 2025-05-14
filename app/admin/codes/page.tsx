import { Metadata } from "next";
import RedemptionCodesManagement from "@/components/admin/RedemptionCodesManagement";

export const metadata: Metadata = {
  title: "Quản lý mã kích hoạt - Admin",
  description: "Quản lý và theo dõi các mã kích hoạt cho khóa học",
};

export default function RedemptionCodesPage() {
  return (
    <div className="container py-6">
      <RedemptionCodesManagement />
    </div>
  );
}
