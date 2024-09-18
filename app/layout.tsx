import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatbot Demo",
  description: "A demo for Angels Among Us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
