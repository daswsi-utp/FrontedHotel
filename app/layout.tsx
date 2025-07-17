import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import ClientLayout from "@/components/ClientLayout"; // <-- Importa el layout de cliente
=======
import ClientLayout from "@/components/ClientLayout"; 
>>>>>>> 17bd83094f4f5bb42c32090606ff8916e573eda4

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nice For You",
  description: "Sleep well, live well.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
<<<<<<< HEAD
        <ClientLayout>
          {children}
        </ClientLayout>
=======
        <ClientLayout>{children}</ClientLayout>
>>>>>>> 17bd83094f4f5bb42c32090606ff8916e573eda4
      </body>
    </html>
  );
}
