"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

interface Test {
  id: number;
  name: string;
  subject?: {
    id: number;
    name: string;
  };
  grade?: {
    id: number;
    name: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const TestsPage = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestsCount();
  }, []);

  useEffect(() => {
    fetchTests();
  }, [pagination.page]);

  // Lấy tổng số bài kiểm tra
  const fetchTestsCount = async () => {
    try {
      const response = await fetch("/api/import-tests");
      if (!response.ok) {
        throw new Error("Không thể kết nối đến máy chủ");
      }
      const data = await response.json();
      
      // Phân tích dữ liệu để lấy subjects và grades
    } catch (error) {
      console.error("Lỗi khi lấy số lượng bài kiểm tra:", error);
    }
  };

  // Lấy danh sách bài kiểm tra
  const fetchTests = async () => {
    setLoading(true);
    try {
      let url = `/api/tests?page=${pagination.page}&limit=${pagination.limit}`;
      
      
      

      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Không thể lấy danh sách bài kiểm tra");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTests(data.data.tests);
        setPagination({
          page: data.data.pagination.page,
          limit: data.data.pagination.limit,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        });
      } else {
        throw new Error(data.error || "Có lỗi xảy ra khi lấy danh sách bài kiểm tra");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài kiểm tra:", error);
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi trang
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Thay đổi tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Ngân Hàng Bài Kiểm Tra</h1>
      
      {/* Thống kê số lượng */}
      <div className="bg-primary/10 p-4 rounded-lg mb-8">
        <p className="text-center">
          <span className="font-semibold">Tổng số bài kiểm tra:</span>{" "}
          {pagination.total > 0 ? (
            <span className="font-bold text-primary">{pagination.total}</span>
          ) : (
            <Loader2 className="inline w-4 h-4 ml-1 animate-spin" />
          )}
        </p>
      </div>
      
      {/* Danh sách bài kiểm tra */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải danh sách bài kiểm tra...</span>
        </div>
      ) : tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Card key={test.id} className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{test.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {test.subject && (
                    <Badge variant="outline" className="bg-blue-50">
                      {test.subject.name}
                    </Badge>
                  )}
                  {test.grade && (
                    <Badge variant="outline" className="bg-green-50">
                      {test.grade.name}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Mã bài kiểm tra: #{test.id}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">Không tìm thấy bài kiểm tra nào phù hợp</p>
        </div>
      )}
      
      {/* Phân trang */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="mr-2"
            >
              Đầu
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="mr-2"
            >
              Trước
            </Button>
            <span className="flex items-center mx-4">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="ml-2"
            >
              Sau
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              className="ml-2"
            >
              Cuối
            </Button>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default TestsPage;
