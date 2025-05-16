import { User, Payment, RedemptionCode } from "@/database";
import dbConnect from "@/lib/mongoose";
import { IUser } from "@/database/user.model";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { Enrollment } from "@/database";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý người dùng | Admin",
  description: "Quản lý người dùng và truy cập khóa học",
};

interface EnhancedUser extends IUser {
  _id: string;
  createdAt: string | null;
  updatedAt: string | null;
  enrollmentCount: number;
  hasSubscription: boolean;
  redeemedCode: boolean;
  redemptionCodeCount: number;
  redeemedViaCode: boolean;
  subscriptionMethod: string | null;
  role?: string;
}

async function getUsers(): Promise<EnhancedUser[]> {
  await dbConnect();
  
  // Get all users
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  
  // Get detailed information for each user
  const usersWithDetails = await Promise.all(
    users.map(async (user: any) => {
      // Count enrollments
      const enrollmentCount = await Enrollment.countDocuments({ user: user._id });
      
      // Check if user has active subscription (completed payment)
      const hasSubscription = await Payment.exists({
        user: user._id,
        status: "completed",
      });
      
      // Get redemption code info if user has redeemed any code
      const redeemedCodes = await RedemptionCode.find({
        redeemedBy: user._id,
        isRedeemed: true
      }).lean();
      
      // Check redemption method in payments
      const redeemedViaCode = await Payment.exists({
        user: user._id,
        method: "physical_code",
        status: "completed"
      });
      
      return {
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt ? user.createdAt.toISOString() : null,
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
        enrollmentCount,
        hasSubscription: !!hasSubscription,
        redeemedCode: redeemedCodes.length > 0,
        redemptionCodeCount: redeemedCodes.length,
        redeemedViaCode: !!redeemedViaCode,
        subscriptionMethod: hasSubscription ? "subscription" : (redeemedViaCode ? "code" : null)
      };
    })
  );
  
  return usersWithDetails;
}

export default async function AdminUsersPage() {
  const users: EnhancedUser[] = await getUsers();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      </div>
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Quyền truy cập</TableHead>
              <TableHead>Khóa học đã mua</TableHead>
              <TableHead>Ngày tham gia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Người dùng
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="space-y-1">
                    {user.hasSubscription && (
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 mr-2">
                        Đã mua subscription
                      </Badge>
                    )}
                    {user.redeemedCode && (
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                        Đã nhập code {user.redemptionCodeCount > 1 ? `(${user.redemptionCodeCount})` : ''}
                      </Badge>
                    )}
                    {!user.hasSubscription && !user.redeemedCode && (
                      <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-500">
                        Chưa có quyền truy cập
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user.enrollmentCount}</span>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? (
                      formatDistance(new Date(user.createdAt), new Date(), {
                        addSuffix: true,
                        locale: vi,
                      })
                    ) : (
                      "Không rõ"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
