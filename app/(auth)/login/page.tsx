"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";

const defaultValues: Partial<LoginFormValues> = {
  email: "",
  password: "",
  rememberMe: false,
};

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    // In a real application, this would make an API call to authenticate the user
    console.log("Login values:", values);

    // For now, we'll simulate a successful login by redirecting to the dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md">
      <AuthForm
        type="login"
        schema={loginSchema}
        defaultValues={defaultValues}
        onSubmit={handleLogin}
      />

      <div className="mt-12 text-center">
        <div className="p-4 bg-primary/5 rounded-xl">
          <p className="text-sm text-gray-600 mb-2">
            <span role="img" aria-label="light bulb">
              💡
            </span>{" "}
            Chưa sẵn sàng đăng ký?
          </p>
          <p className="text-sm font-medium">
            Dùng thử Havamath mà không cần tài khoản để trải nghiệm các bài học.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
