"use client";

import React, { useState, ChangeEvent } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { axios_with_refresh_token } from "@/lib/custom-axios";
import Icon from "../icon";
import Link from "next/link";
import { BACKEND_URL } from "@/config/env";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import PasswordInput from "../password-input";

function Signup() {
  const [firstName, registerFirstName, firstNameError] = useDebouncedValue(
    "",
    500
  );
  const [lastName, registerLastName, lastNameError] = useDebouncedValue(
    "",
    500
  );
  const [email, registerEmail, emailError] = useDebouncedValue("", 500, [
    { pattern: /^\S+@\S+\.\S+$/, error_message: "Email is invalid" },
  ]);
  const [password, registerPassword, passwordError] = useDebouncedValue(
    "",
    500,
    [
      {
        pattern: /^.{8,}$/,
        error_message: "Password is too short",
      },
      {
        pattern: /[A-Z]+/,
        error_message: "must contain at least one uppercase character",
      },
      {
        pattern: /[a-z]+/,
        error_message: "must contain at least one lowecase character",
      },
      {
        pattern: /[0-9]+/,
        error_message: "must contain at least one number",
      },
    ]
  );
  const [confirmPassword, registerConfirmPassword] = useDebouncedValue("", 500);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <section className="w-full relative px-0 sm:p-8 max-w-md sm:max-w-lg mx-auto text-foreground text-[14px]">
      <div className="rounded-[8px] bg-background p-5 my-[10%] relative">
        <div className="grid gap-2 mb-6 text-center">
          <h1 className="text-[28px] font-bold">Welcome to yellow page!</h1>
          <p className="text-[14px] text-foreground/75">
            Please enter your credentials to continue.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (
              emailError ||
              !email ||
              passwordError ||
              !password ||
              firstNameError ||
              !firstName ||
              lastNameError ||
              !lastName ||
              !confirmPassword
            )
              return setError("Credentials are not valid!");

            setError("");

            try {
              setLoading(true);

              const res = await fetch(BACKEND_URL + "/api/auth/register", {
                method: "POST",
                credentials: "include",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  firstName,
                  lastName,
                  email,
                  password,
                }),
              }).then((res) => res.json());

              navigator.clipboard.writeText(JSON.stringify(res, null, 2));

              setLoading(false);
            } catch (err) {
              setLoading(false);
            }
          }}
          className="flex flex-col gap-2"
        >
          <div className="grid md:grid-cols-2 gap-3">
            <Input
              error={firstNameError}
              name="name"
              label="Name"
              placeholder="Your name"
              {...registerFirstName()}
            />

            <Input
              error={lastNameError}
              name="last_name"
              label="Last Name"
              placeholder="Your last name"
              {...registerLastName()}
            />
          </div>

          <Input
            error={emailError}
            name="email"
            label="Email"
            placeholder="test@gmail.com"
            {...registerEmail()}
          />

          <div className="grid md:grid-cols-2 gap-3">
            <PasswordInput
              error={passwordError}
              name="password"
              label="Password"
              placeholder="unbreakable"
              {...registerPassword()}
            />
            <PasswordInput
              error={
                confirmPassword !== password && confirmPassword
                  ? "Password doesn't match"
                  : ""
              }
              name="password_confirm"
              label="Confirm"
              placeholder="unbreakable"
              {...registerConfirmPassword()}
            />
          </div>

          <Button loading={loading} className="mt-4">
            SIGNUP
          </Button>
          {error ? <p className="text-error ">{error}</p> : null}
        </form>

        <div className="w-full flex gap-3 items-center reltive my-6">
          <span className="flex h-[1px] bg-border w-full" />
          <p className="text-[12px] text-border flex-shrink-0">
            OR CONTINUE WITH
          </p>
          <span className="flex h-[1px] bg-border w-full" />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Button variant="outlined" color="foreground">
            <Icon name="Google" className="text-[21px]" /> Google
          </Button>
          <Button variant="outlined" color="foreground">
            <Icon name="Facebook" className=" text-[21px]" /> Facebook
          </Button>
        </div>

        <div className="mt-3">
          <p className="text-foreground/75">
            Already have an account?{" "}
            <Link
              className="underline text-foreground font-medium"
              href="/signin"
            >
              sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Signup;