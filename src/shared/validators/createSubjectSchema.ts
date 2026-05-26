import * as yup from "yup";

export const createSubjectSchema = yup.object({
    name: yup.string().required("validation.required"),
    organizationName: yup.string().required("validation.required"),
    edition: yup.string().required("validation.required"),
    subjectDescription: yup.string().nullable().default(null),
    giteaURL: yup.string().url("validation.url.invalid").required("validation.required"),
}).required();

export type CreateSubjectFormData = yup.InferType<typeof createSubjectSchema>;