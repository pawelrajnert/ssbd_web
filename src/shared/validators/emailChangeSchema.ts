import * as yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailChangeSchema = yup.object({
    password: yup.string()
        .required("Current password is required to finish an email change"),
    newEmail: yup.string()
        .required("New email is required")
        .matches(emailRegex, "Please provide a valid email address")
}).required();

export type EmailChangeFormData = yup.InferType<typeof emailChangeSchema>;