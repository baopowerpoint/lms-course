import { PropsWithChildren } from "react";

export default function CourseLearnLayout({
  children,
}: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
