import * as yup from "yup";

export const registerSchema = yup.object({
    name: yup.string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(32, "Name cannot exceed 32 characters")
        .matches(/^[\p{L}][\p{L}\s\-']+$/u, "Name must start with a letter and contain only letters, spaces, hyphens, and apostrophes"),

    surname: yup.string()
        .required("Surname is required")
        .min(3, "Surname must be at least 3 characters")
        .max(32, "Surname cannot exceed 32 characters")
        .matches(/^[\p{L}][\p{L}\s\-']+$/u, "Surname must start with a letter and contain only letters, spaces, hyphens, and apostrophes"),

    login: yup.string()
        .required("Login is required")
        .min(3, "Login must be at least 3 characters")
        .max(32, "Login cannot exceed 32 characters")
        .matches(/^[a-zA-Z0-9]+$/, "Login can only contain letters and numbers"),

    email: yup.string()
        .required("Email is required")
        .email("Must be a valid email address"),

    password: yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password can be up to 64 characters long")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "Password must contain at least one uppercase letter and a special symbol"),

    confirmPassword: yup.string()
        .required("Please confirm your password")
        .oneOf([yup.ref('password')], "Passwords do not match"),

    termsAccepted: yup.boolean()
        .required("You must accept the terms and conditions")
        .oneOf([true], "You must accept the terms and conditions")
}).required();

export type RegisterFormData = yup.InferType<typeof registerSchema>;