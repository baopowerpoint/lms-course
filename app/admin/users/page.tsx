import { User } from "@/database";
import dbConnect from "@/lib/mongoose";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { Enrollment } from "@/database";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý người dùng | Admin",
  description: "Quản lý người dùng và truy cập khóa học",
};

async function getUsers() {
  await dbConnect();
  
  // Get all users
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  
  // Get enrollment counts for each user
  const usersWithEnrollments = await Promise.all(
    users.map(async (user) => {
      const enrollmentCount = await Enrollment.countDocuments({ user: user._id });
      
      return {
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt ? user.createdAt.toISOString() : null,
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
        enrollmentCount
      };
    })
  );
  
  return usersWithEnrollments;
}

export default async function AdminUsersPage() {
  const users = await getUsers();
  
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
