import AuthChecker from '@/components/AuthChecker';
import '@etchteam/next-pagination/dist/index.css'

import React from 'react';
import { Toaster } from "@/components/ui/toaster"

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { inter } from "@/fonts";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Fatvo App",
  description: "By Saidoff",
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} bg-[#FDFBF6] antialiased min-h-screen flex flex-col justify-between`}
      >
        <div className='relative min-h-screen overflow-hidden'>
          <div className='bg-center bg-repeat-y h-full w-full absolute top-[300px] z-[1]' style={{ backgroundImage: "url('/ask-bg.png')", backgroundSize: "800px" }}>
          </div>
          <NextIntlClientProvider messages={messages}>
            <div className="flex flex-col min-h-screen relative z-[21]">
              <Header />
              {children}
            </div>
            <Footer />

            <AuthChecker />
            <Toaster />

          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
