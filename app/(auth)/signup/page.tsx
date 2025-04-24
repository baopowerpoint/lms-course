"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { signupSchema, type SignupFormValues } from "@/lib/validators/auth";

const defaultValues: Partial<SignupFormValues> = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const SignupPage = () => {
  const router = useRouter();

  const handleSignup = async (values: SignupFormValues): Promise<void> => {
    // In a real application, this would make an API call to register the user
    console.log("Signup values:", values);

    // For now, we'll simulate a successful registration by redirecting to the onboarding page
    setTimeout(() => {
      router.push("/onboarding");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md">
      <AuthForm
        type="signup"
        schema={signupSchema}
        defaultValues={defaultValues}
        onSubmit={handleSignup}
      />

      <div className="mt-12 text-center">
        <div className="p-4 bg-primary/5 rounded-xl">
          <p className="text-sm text-gray-600 mb-2">
            <span role="img" aria-label="graduation cap">
              🎓
            </span>{" "}
            Đã sẵn sàng học?
          </p>
          <p className="text-sm font-medium">
            Tạo tài khoản giúp bạn theo dõi tiến độ và mở khóa tất cả tính năng
            của Havamath.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
