"use client";

import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontWeight: 400 }}>Welcome!</h1>
      <p>Save your favorite recipes and turn them into smart grocery lists in a tap.</p>

      {/* Button container */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => signIn("google")}
          style={{
            padding: "0.6rem 1.4rem",
            backgroundColor: "#D3B898",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Log In with Google
        </button>

        {/* Might remove this... */}
        <a
          href="/signup"
          style={{
            padding: "0.6rem 1.4rem",
            backgroundColor: "#D3B898",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}