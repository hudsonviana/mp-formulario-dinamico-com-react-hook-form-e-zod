import { useState } from "react";
import { EyeIcon, Loader } from "lucide-react";
import { EyeOffIcon } from "lucide-react";
import { useHookFormMask } from "use-mask-input";
import { FieldValues, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// https://www.youtube.com/watch?v=H2_yqSFCy4g&t=846s&ab_channel=Codante-Evoluanofront-end
// Parei com 1h20min

export default function Form() {
  const [isPassVisible, setIsPassVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm();

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
    console.log(resData);

    if (!response.ok) {
      for (const field in resData.errors) {
        setError(field, { type: "manual", message: resData.errors[field] });
      }
    } else {
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input
          type="text"
          id="name"
          {...register("name", {
            required: "O Campo nome é obrigatório",
            maxLength: {
              value: 200,
              message: "O nome deve ter no máximo 200 caracteres",
            },
          })}
          autoComplete="new-password"
        />

        {/* {errors.name?.message as string} */}
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
          {...register("email", { required: "O Email é obrigatório" })}
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
            {...register("password", {
              required: "A senha é obrigatória",
              minLength: {
                value: 8,
                message: "A senha precisa ter pelo menos 8 caracteres",
              },
            })}
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
            {...register("password_confirmation", {
              required: "A confirmação de senha é obrigatória",
              minLength: {
                value: 8,
                message: "A senha deve ter no mínio de 8 caracteres",
              },
              validate(value, formValues) {
                if (value === formValues.password) return true;
                return "As senhas devem coincidir";
              },
            })}
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
          // ref={withMask("(99) 99999-9999")}
          {...registerWithMask("phone", "(99) 99999-9999", {
            required: "O campo telefone é obrigatório",
            pattern: {
              value: /^\(\d{2}\)\s\d{5}-\d{4}$/,
              message: "Telefone inválido",
            },
          })}
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
          // ref={withMask("999.999.999-99")}
          {...registerWithMask("cpf", "999.999.999-99", {
            required: "O campo CPF é obrigatório",
            pattern: {
              value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              message: "CPF inválido",
            },
          })}
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
          // ref={withMask("99999-999")}
          {...registerWithMask("zipcode", "99999-999", {
            required: "O campo CEP é obrigatório",
            pattern: {
              value: /^\d{5}-\d{3}$/,
              message: "CEP inválido",
            },
          })}
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
          // value={address.street}
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
      {/* terms and conditions input */}
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          {...register("terms", {
            required: "Os termos e condições devem ser aceitos",
          })}
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
