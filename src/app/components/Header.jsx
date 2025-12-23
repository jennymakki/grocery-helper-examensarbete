"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header-premium ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        {/* Brand */}
        <span className="header-brand">
          Grocery <span>Helper</span>
        </span>

        {/* Auth Button */}
        {session ? (
          <button
            onClick={() => signOut()}
            className="header-login"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="header-login"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}