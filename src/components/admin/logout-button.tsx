"use client";

import { useState } from "react";

export function LogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function logout() {
    setIsSubmitting(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.replace("/login");
  }

  return (
    <button className="secondary-button" type="button" onClick={logout} disabled={isSubmitting}>
      {isSubmitting ? "Abmeldung …" : "Abmelden"}
    </button>
  );
}
