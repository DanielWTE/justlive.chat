import { z } from "zod";

export const updateNameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(30, "Name cannot exceed 30 characters"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmNewPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

export type UpdateNameFormData = z.infer<typeof updateNameSchema>;
export type UpdateEmailFormData = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>; 