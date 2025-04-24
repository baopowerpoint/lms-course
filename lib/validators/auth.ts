import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tên là bắt buộc" })
    .max(50, { message: "Tên không được vượt quá 50 ký tự" }),
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Xác nhận mật khẩu là bắt buộc" }),
  terms: z
    .boolean()
    .refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản và điều kiện",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupSchema>;
