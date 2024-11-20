import {z} from "zod";

export const userSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Not a valid name",
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  email: z
    .string({required_error: "Email is required"})
    .email("Invalid email format"),
  password: z
    .string({
      invalid_type_error: "Not a valid password.",
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Male", "Female"], {
    errorMap: () => ({message: "Gender must be either 'Male' or 'Female'"}),
  }),
  age: z.coerce
    .number({
      invalid_type_error: "Not a valid age",
      required_error: "Age is required",
    })
    .min(18, "Age must be at least 18"),
});

export const updateUserSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Not a valid name",
    })
    .min(1, "Name is required")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  gender: z
    .enum(["Male", "Female"], {
      errorMap: () => ({message: "Gender must be either 'Male' or 'Female'"}),
    })
    .optional(),
  age: z.coerce
    .number({
      invalid_type_error: "Not a valid age",
    })
    .min(18, "Age must be at least 18")
    .optional(),
});

export const notesSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Not a valid title",
    })
    .min(1, "Title is required"),
  content: z
    .string({
      invalid_type_error: "Not a valid content string",
    })
    .optional(),
  pinned: z.coerce
    .boolean({
      invalid_type_error: "Not a valid boolean value",
    })
    .optional(),
  reminder: z
    .string({
      invalid_type_error: "Not a valid date",
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({required_error: "Email is required"})
    .email("Invalid email format"),
  password: z
    .string({
      invalid_type_error: "Not a valid password.",
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
});
