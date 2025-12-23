"use client";

import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <section className="hero-premium">
      <h1 className="hero-premium-title">
        Cook with intention.<br />Shop with clarity.
      </h1>

      <p className="hero-premium-subtitle">
        Grocery Helper is a calm, smart space for your recipes and grocery lists.
        Save what you cook, plan effortlessly, and let your shopping organize itself.
      </p>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="premium-cta"
      >
        Continue with Google
      </button>

    </section>
  );
}