import * as yup from "yup";

export const loginSchema = yup.object({
    login: yup.string()
        .required("Login is required"),
    password: yup.string()
        .required("Password is required"),
    rememberMe: yup.boolean().default(false).required()
}).required();

export type LoginFormData = yup.InferType<typeof loginSchema>;