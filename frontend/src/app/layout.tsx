import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Providers from "@/providers/Providers";
import TopMenu from "@/components/TopMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SportBook",
  description: "Sports facility booking",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers session={session}>
          <TopMenu />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
