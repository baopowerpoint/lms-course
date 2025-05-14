"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createRedemptionCode,
  getAllRedemptionCodes,
  deactivateRedemptionCode,
} from "@/lib/actions/redemption-code.actions";
import { toast } from "sonner";
import { KeyIcon, Loader2, Copy, Trash2, PlusCircle } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RedemptionCodesManagement() {
  const [codes, setCodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // No amount needed as codes don't have a specific value
  const [quantity, setQuantity] = useState(1);

  // Fetch codes on initial load
  const fetchCodes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllRedemptionCodes();
      if (response.success) {
        setCodes(response.data || []);
      } else {
        toast.error("Không thể tải danh sách mã");
      }
    } catch (error) {
      console.error("Error fetching codes:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new code
  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const response = await createRedemptionCode(quantity);
      if (response.success) {
        toast.success(`Đã tạo ${quantity} mã mới thành công`);
        fetchCodes(); // Refresh the list
      } else {
        toast.error(response.error || "Không thể tạo mã");
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Đã xảy ra lỗi khi tạo mã");
    } finally {
      setIsGenerating(false);
    }
  };

  // Deactivate code
  const handleDeactivateCode = async (codeId: string) => {
    try {
      const response = await deactivateRedemptionCode(codeId);
      if (response.success) {
        toast.success("Đã vô hiệu hóa mã thành công");
        // Update local state to reflect change
        setCodes(
          codes.map((code) =>
            code.id === codeId ? { ...code, isActive: false } : code
          )
        );
      } else {
        toast.error(response.error || "Không thể vô hiệu hóa mã");
      }
    } catch (error) {
      console.error("Error deactivating code:", error);
      toast.error("Đã xảy ra lỗi khi vô hiệu hóa mã");
    }
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Đã sao chép mã vào clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <KeyIcon className="h-6 w-6" />
          Quản lý mã kích hoạt
        </h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tạo mã mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyIcon className="h-5 w-5" />
                Tạo mã kích hoạt mới
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground pb-2 pt-2">
                Mã kích hoạt sẽ dùng để mở khóa truy cập vào tất cả các khóa học, không có giá trị tiền tệ cụ thể.
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Số lượng:</label>
                <Select
                  defaultValue={quantity.toString()}
                  onValueChange={(value) => setQuantity(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn số lượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mã</SelectItem>
                    <SelectItem value="5">5 mã</SelectItem>
                    <SelectItem value="10">10 mã</SelectItem>
                    <SelectItem value="20">20 mã</SelectItem>
                    <SelectItem value="50">50 mã</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <KeyIcon className="mr-2 h-4 w-4" />
                    Tạo {quantity} mã kích hoạt
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách mã kích hoạt</CardTitle>
          <CardDescription>
            Quản lý và theo dõi các mã kích hoạt đã tạo trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={fetchCodes} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>Làm mới</>
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Trạng thái</TableHead>

                    <TableHead>Người dùng</TableHead>
                    <TableHead>Ngày sử dụng</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-6 text-muted-foreground"
                      >
                        Chưa có mã nào được tạo hoặc nhấn "Làm mới" để tải dữ
                        liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    codes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono font-bold tracking-wider">
                          {code.code}
                        </TableCell>
                        <TableCell>
                          {code.isRedeemed ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-600 border-green-200"
                            >
                              Đã sử dụng
                            </Badge>
                          ) : code.isActive ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-600 border-blue-200"
                            >
                              Có hiệu lực
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-600 border-gray-200"
                            >
                              Vô hiệu hóa
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {code.redeemedBy ? code.redeemedBy.email : "-"}
                        </TableCell>
                        <TableCell>
                          {code.redeemedAt ? formatDate(code.redeemedAt) : "-"}
                        </TableCell>
                        <TableCell>{formatDate(code.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(code.code)}
                              title="Sao chép mã"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {!code.isRedeemed && code.isActive && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeactivateCode(code.id)}
                                title="Vô hiệu hóa mã"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
