import { z } from "zod";

export const userRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "O campo nome precisa ser preenchido, ok!!!!!!" }),
    email: z
      .string()
      .min(1, { message: "O campo email precisa ser preenchido" })
      .email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "O campo senha precisa ter pelo menos 8 caracteres" }),
    password_confirmation: z.string().min(8, {
      message: "A senha de confirmação precisa ter pelo menos 8 caracteres",
    }),
    phone: z
      .string()
      .min(1, { message: "O campo telefone precisa ser preenchido" })
      .regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, { message: "Telefone inválido" }),
    cpf: z
      .string()
      .min(1, { message: "O campo CPF precisa ser preenchido" })
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido" }),
    zipcode: z
      .string()
      .min(1, { message: "O campo CEP precisa ser preenchido" })
      .regex(/^\d{5}-\d{3}$/, { message: "CEP inválido" }),
    city: z
      .string()
      .min(1, { message: "O campo cidade precisa ser preenchido" }),
    address: z
      .string()
      .min(1, { message: "O campo Estado precisa ser preenchido" }),
    terms: z.boolean().refine((value) => value === true, {
      message: "Precisa aceitar os termos de uso",
    }),
  })
  .refine(
    (data) => {
      return data.password === data.password_confirmation;
    },
    {
      message: "As senhas devem coincidir",
      path: ["password_confirmation"],
    }
  );

export type UserRegister = z.infer<typeof userRegisterSchema>;
