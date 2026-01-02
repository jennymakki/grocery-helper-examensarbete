import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Providers from "./providers";

export const metadata = {
  metadataBase: new URL("https://grocery-helper-examensarbete.vercel.app/"),
  title: {
    default: "Grocery Helper",
    template: "%s – Grocery Helper",
  },
  description: "Plan meals, save recipes, and create grocery lists.",
  icons: {
    icon: "/favicon-32.png",
    shortcut: "/favicon-32.png",
    apple: "/favicon-32.png",
  },
  openGraph: {
    title: "Grocery Helper",
    description: "Plan meals, save recipes, and create grocery lists.",
    url: "https://yourdomain.com",
    siteName: "Grocery Helper",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grocery Helper – Cook with intention. Shop with clarity",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grocery Helper",
    description: "Plan meals, save recipes, and create grocery lists.",
    images: ["/og-image.png"],
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
