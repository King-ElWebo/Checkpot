import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="eyebrow">Geschützter Bereich</div>
        <h1 id="login-title">Admin Platform</h1>
        <p className="muted">
          Melde dich an, um den technischen Projektstatus zu öffnen.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
