"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header-premium ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        <span className="header-brand">
          Grocery <span>Helper</span>
        </span>

        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="header-login"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="header-login"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
