"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UploadCloud,
  Database,
  AlertTriangle,
  CheckCircle,
  Loader2,
  FileJson,
  BarChart,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function TestImportPage() {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [processedItems, setProcessedItems] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{
    totalTests: number;
    subjects: { id: number; name: string; count: number }[];
    grades: { id: number; name: string; count: number }[];
  } | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  // Kiểm tra trạng thái hệ thống
  const checkSystemStatus = async () => {
    try {
      const response = await fetch("/api/tests", {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Không thể kết nối đến API");
      }
      
      const data = await response.json();
      setResult({
        success: true,
        message: `Hiện có ${data.data.pagination.total} bài kiểm tra trong hệ thống`,
        count: data.data.pagination.total
      });
      toast.success(`Hệ thống có ${data.data.pagination.total} bài kiểm tra`);
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái:", error);
      setResult({
        success: false,
        message: `Lỗi khi kiểm tra: ${(error as Error).message}`,
      });
      toast.error(`Lỗi khi kiểm tra hệ thống: ${(error as Error).message}`);
    }
  };

  // Bắt đầu quá trình import dữ liệu
  const startImport = async () => {
    try {
      setIsImporting(true);
      setImportStatus("Đang bắt đầu import dữ liệu...");
      setProgress(0);
      setResult(null);
      
      const response = await fetch("/api/import-tests", {
        method: "POST",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi khi import dữ liệu");
      }
      
      const data = await response.json();
      setResult({
        success: true,
        message: data.message,
      });
      toast.success(data.message);
      
      // Cập nhật trạng thái sau khi import
      await checkSystemStatus();
    } catch (error) {
      console.error("Lỗi khi import:", error);
      setResult({
        success: false,
        message: `Lỗi khi import: ${(error as Error).message}`,
      });
      toast.error(`Lỗi khi import: ${(error as Error).message}`);
    } finally {
      setIsImporting(false);
      setImportStatus(null);
    }
  };

  // Kiểm tra thống kê về dữ liệu
  const analyzeData = async () => {
    try {
      setImportStatus("Đang phân tích dữ liệu...");
      setIsImporting(true);
      setProgress(20);

      // Sử dụng API endpoint phân tích dữ liệu
      const response = await fetch("/api/tests/analyze", {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Không thể phân tích dữ liệu");
      }
      
      setProgress(60);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Lỗi khi phân tích dữ liệu");
      }
      
      setProgress(100);
      
      // Hiển thị kết quả phân tích
      setStats({
        totalTests: data.data.totalTests || 0,
        subjects: data.data.subjects || [],
        grades: data.data.grades || []
      });
      
      toast.success(`Đã phân tích xong ${data.data.totalTests} bài kiểm tra với ${data.data.totalQuestions} câu hỏi`);
      
      setIsImporting(false);
      setImportStatus(null);
      
    } catch (error) {
      console.error("Lỗi khi phân tích dữ liệu:", error);
      toast.error(`Lỗi khi phân tích dữ liệu: ${(error as Error).message}`);
      setIsImporting(false);
      setImportStatus(null);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Quản lý Ngân Hàng Bài Kiểm Tra</h1>
      
      <div className="grid gap-6">
        {/* Trạng thái hệ thống */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Trạng thái hệ thống</CardTitle>
            <CardDescription>
              Kiểm tra số lượng bài kiểm tra hiện có trong ngân hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <div className={`p-4 border rounded-md ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? 
                    <CheckCircle className="h-5 w-5 text-green-500" /> : 
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  }
                  <span className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.success ? 'Thành công' : 'Lỗi'}
                  </span>
                </div>
                <p className="text-slate-700">{result.message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={checkSystemStatus} disabled={isImporting}>
              <Database className="mr-2 h-4 w-4" />
              Kiểm tra số bài kiểm tra
            </Button>
          </CardFooter>
        </Card>

        {/* Import dữ liệu */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Import dữ liệu bài kiểm tra</CardTitle>
            <CardDescription>
              Import dữ liệu từ file tests.json ở thư mục gốc của dự án
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <FileJson className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-amber-700">Lưu ý quan trọng</span>
              </div>
              <p className="text-slate-700">
                Đảm bảo file tests.json đã được đặt ở thư mục gốc của dự án. 
                File này phải chứa một mảng các bài kiểm tra theo định dạng chuẩn.
              </p>
            </div>

            {isImporting && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{importStatus}</span>
                  <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex gap-3">
              <Button
                onClick={startImport}
                disabled={isImporting}
                variant="default"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang import...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Bắt đầu import
                  </>
                )}
              </Button>
              
              <Button
                onClick={analyzeData}
                disabled={isImporting}
                variant="outline"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Phân tích dữ liệu
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Thống kê dữ liệu */}
        {stats && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Thống kê dữ liệu</CardTitle>
              <CardDescription>
                Phân tích dữ liệu bài kiểm tra theo môn học và lớp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Theo môn học</h3>
                  <div className="space-y-2">
                    {stats.subjects.map(subject => (
                      <div key={subject.id} className="flex justify-between">
                        <span>{subject.name}</span>
                        <span className="font-medium">{subject.count} bài</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Theo lớp</h3>
                  <div className="space-y-2">
                    {stats.grades.map(grade => (
                      <div key={grade.id} className="flex justify-between">
                        <span>{grade.name}</span>
                        <span className="font-medium">{grade.count} bài</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
