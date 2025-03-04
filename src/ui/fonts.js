import { Inter } from 'next/font/google';

const inter = Inter({
  style: ["italic", "normal"],
  weight: 'variable',
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
});

export { inter };