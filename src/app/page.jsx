"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./components/LoadingSkeleton";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <section className="hero-premium">
        <LoadingSkeleton
          width="60%"
          height="3rem"
          style={{ marginBottom: "1rem" }}
        />
        <LoadingSkeleton
          width="80%"
          height="1.2rem"
          style={{ marginBottom: "0.5rem" }}
        />
        <LoadingSkeleton
          width="40%"
          height="2.5rem"
          style={{ marginTop: "1rem" }}
        />
      </section>
    );
  }

  return (
    <section className="hero-premium">
      <h1 className="hero-premium-title">
        Cook with intention.
        <br />
        Shop with clarity.
      </h1>

      <p className="hero-premium-subtitle">
        Grocery Helper is a calm, smart space for your recipes and grocery
        lists. Save what you cook, plan effortlessly, and let your shopping
        organize itself.
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
