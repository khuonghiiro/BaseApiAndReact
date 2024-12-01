import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Helpdesk Thiên Hoàng",
  description: "Helpdesk Thiên Hoàng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
