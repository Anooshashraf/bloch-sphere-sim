import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "Quantum BlochSphere Simulator",
  description:
    "Interactive Bloch Sphere, Circuit Editor, and Quantum Algorithms",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d0d16] text-white min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-[#13131a] border-b border-[#24243a] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[#ffc300] text-lg font-semibold">
            Quantum Simulator
          </Link>
          <div className="flex gap-6">
            <Link href="/bloch" className="hover:text-[#ffc300]">
              Bloch Sphere
            </Link>
            <Link href="/circuit" className="hover:text-[#ffc300]">
              Circuit
            </Link>
            <Link href="/algorithms" className="hover:text-[#ffc300]">
              Algorithms
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-[#13131a] border-t border-[#24243a] text-center text-sm text-gray-400 py-3">
          © 2025 Quantum Simulator. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
