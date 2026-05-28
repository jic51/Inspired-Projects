import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scenix — Step Inside the Video",
  description:
    "Watch videos and step inside the scene. Explore in 3D and buy what you see.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
