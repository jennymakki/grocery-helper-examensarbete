import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Providers from "./providers";

export const metadata = {
  title: {
    default: "Grocery Helper",
    template: "%s – Grocery Helper",
  },
  description:
    "Plan meals, save recipes, and create grocery lists.",
    icons: {
      icon: "/favicon-32.png",
      shortcut: "/favicon-32.png",
      apple: "/favicon-32.png",
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="app-main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}