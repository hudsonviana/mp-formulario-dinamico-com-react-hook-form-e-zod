import { useState } from "react";
import { EyeIcon, Loader } from "lucide-react";
import { EyeOffIcon } from "lucide-react";
import { useHookFormMask } from "use-mask-input";
import { FieldValues, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema } from "../schema";
import type { UserRegister } from "../schema";
import toast from "react-hot-toast";

// https://www.youtube.com/watch?v=H2_yqSFCy4g&t=846s&ab_channel=Codante-Evoluanofront-end

export default function Form() {
  const [isPassVisible, setIsPassVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister>({ resolver: zodResolver(userRegisterSchema) });

  const registerWithMask = useHookFormMask(register);

  async function handleZipcodeBlur(e: React.FocusEvent<HTMLInputElement>) {
    const zipcode = e.target.value;

    const response = await fetch(
      `https://brasilapi.com.br/api/cep/v2/${zipcode}`
    );

    if (response.ok) {
      const data = await response.json();

      setValue("address", data.street);
      setValue("city", data.city);
    }
  }

  async function onSubmit(data: FieldValues) {
    console.log("submetido:", data);

    const response = await fetch(
      "https://apis.codante.io/api/register-user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      for (const field in resData.errors) {
        setError(field as keyof UserRegister, {
          type: "manual",
          message: resData.errors[field],
        });
      }
      toast.error("Erro ao cadastrar usuário");
    } else {
      console.log(resData);
      toast.success("Usuário cadastrado com sucesso!");
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input
          type="text"
          id="name"
          {...register("name")}
          autoComplete="new-password"
        />

        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="name" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input
          className=""
          type="text"
          id="email"
          {...register("email")}
          autoComplete="new-password"
        />

        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="email" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={isPassVisible ? "text" : "password"}
            id="password"
            {...register("password")}
            autoComplete="new-password"
          />
          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsPassVisible(!isPassVisible)}
            >
              {isPassVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>

          <p className="text-xs text-red-400 mt-1">
            <ErrorMessage errors={errors} name="password" />
          </p>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="password_confirmation">Confirmar Senha</label>
        <div className="relative">
          <input
            type={isPassVisible ? "text" : "password"}
            id="password_confirmation"
            {...register("password_confirmation")}
            autoComplete="new-password"
          />
          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsPassVisible(!isPassVisible)}
            >
              {isPassVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
          <p className="text-xs text-red-400 mt-1">
            <ErrorMessage errors={errors} name="password_confirmation" />
          </p>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <input
          type="text"
          id="phone"
          {...registerWithMask("phone", "(99) 99999-9999")}
          autoComplete="new-password"
        />

        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="phone" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          {...registerWithMask("cpf", "999.999.999-99")}
          autoComplete="new-password"
        />

        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="cpf" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="zipcode">CEP</label>
        <input
          type="text"
          id="zipcode"
          {...registerWithMask("zipcode", "99999-999")}
          onBlur={handleZipcodeBlur}
          autoComplete="new-password"
        />

        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="zipcode" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          {...register("address")}
          disabled
        />
      </div>
      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          {...register("city")}
          disabled
        />
      </div>
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          {...register("terms")}
        />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{" "}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="terms" />
        </p>
      </div>

      <button
        type="submit"
        className="bg-slate-800 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors flex justify-center disabled:bg-slate-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader className="animate-spin" /> : "Cadastrar"}
      </button>
    </form>
  );
}
