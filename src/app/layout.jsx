"use client";

import './globals.css';
import { SessionProvider } from "next-auth/react";
import Header from './components/Header';
import Footer from './components/Footer';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <SessionProvider>
        <Header />
        <main className="app-main">
          {children}
        </main>
        <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}