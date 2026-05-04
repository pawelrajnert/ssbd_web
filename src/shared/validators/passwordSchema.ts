import * as yup from "yup";

export const passwordSchema = yup.object({
    newPassword: yup.string()
        .required("Password is required")
        .min(12, "Password must be at least 12 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: yup.string()
        .required("Please confirm your password")
        .oneOf([yup.ref('newPassword')], "Passwords do not match")
}).required();

export type PasswordFormData = yup.InferType<typeof passwordSchema>;