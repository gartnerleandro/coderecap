"use client";

import { signIn } from "next-auth/react";
import { IconBrandGithub } from "@tabler/icons-react";

import "./sign-in.css";

export default function SignIn() {
  return (
    <form
      action={() => {
        signIn("github", { redirectTo: "/card" });
      }}
    >
      <button type="submit" className="github-button">
        <IconBrandGithub className="icon" />
        Iniciar sesión
      </button>
    </form>
  );
}
