import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Italianno } from "next/font/google";
import "./globals.css";

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={italianno.className}>
        <Header />
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}