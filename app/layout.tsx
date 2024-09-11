import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Head from 'next/head';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { dark } from "@clerk/themes";
import Provider from "./Provider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LiveDocs",
  description: "Collaborative text editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark, variables: { colorPrimary: "#3371FF", fontSize: "16px" } }}>
      <html lang="en" className="dark">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
