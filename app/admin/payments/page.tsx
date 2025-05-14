import PaymentsManagement from "@/components/admin/PaymentsManagement";

export const metadata = {
  title: "Quản lý thanh toán | Admin",
  description: "Quản lý và duyệt các thanh toán từ người dùng",
};

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý thanh toán</h1>
      <PaymentsManagement />
    </div>
  );
}
