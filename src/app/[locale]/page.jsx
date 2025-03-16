
"use client"

import Main from "@/components/Main/Main";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import MostRead from "@/components/MostRead/MostRead";
import FatwasSection from "@/components/FatwasSection/FatwasSection";
import dynamic from 'next/dynamic'

const BooksSection = dynamic(() => import('@/components/BooksSection/BooksSection'), { ssr: false })
const MediaSection = dynamic(() => import('@/components/MediaSection/MediaSection'), { ssr: false })
const ArticlesSection = dynamic(() => import('@/components/ArticlesSection/ArticlesSection'), { ssr: false })



export default function Home() {
  const t = useTranslations('')

  return (
    <div className="flex flex-col bg-[#FDFBF6]">
      <Main />

      <section className="mb-16 max-sm:mb-8 -mt-[40px] relative">
        <div className="absolute h-[96px] w-full left-0 -top-[48px] z-[10]" style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FDFBF6 100%)"
        }}></div>
        <div className="container relative z-[11] flex flex-col">
          <div
            className="flex justify-between items-end gap-4 mb-10 max-sm:mb-5"
          >
            <div>
              <h4 className="text-brand font-medium uppercase text-xl/[20px] [@media(max-width:576px)]:text-base/[16px]">{t("questions-and-answers")}</h4>
              <h2 className="mt-3 [@media(max-width:576px)]:mt-1 [@media(max-width:576px)]:text-[22px]/[28px] font-extrabold text-[40px]/[52px] -tracking-[0.64px]">{t("most_read_questions")}</h2>
            </div>
            <Button size="lg" className="max-md:hidden" asChild>
              <Link href="/questions">
                <h3>{t("all_questions")}</h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 18.43V17.93H7C5.61362 17.93 4.49716 17.47 3.72855 16.7014C2.95994 15.9328 2.5 14.8164 2.5 13.43V7.42999C2.5 6.04362 2.95994 4.92716 3.72855 4.15855C4.49716 3.38994 5.61362 2.92999 7 2.92999H17C18.3864 2.92999 19.5028 3.38994 20.2714 4.15855C21.0401 4.92716 21.5 6.04362 21.5 7.42999V13.43C21.5 14.8164 21.0401 15.9328 20.2714 16.7014C19.5028 17.47 18.3864 17.93 17 17.93H13H12.8489L12.7231 18.0137L8.27308 20.9737L8.27306 20.9737L8.26833 20.9769C7.94792 21.1953 7.5 20.9676 7.5 20.56V18.43ZM13.5374 10.866L13.5374 10.866L13.5404 10.864L13.55 10.8574C13.8726 10.6391 14.91 9.93682 14.91 8.52999C14.91 6.92385 13.6061 5.61999 12 5.61999C10.3939 5.61999 9.09 6.92385 9.09 8.52999C9.09 9.21613 9.65386 9.77999 10.34 9.77999C11.0261 9.77999 11.59 9.21613 11.59 8.52999C11.59 8.30613 11.7761 8.11999 12 8.11999C12.2239 8.11999 12.41 8.30613 12.41 8.52999C12.41 8.55593 12.4071 8.56533 12.4068 8.56625C12.4066 8.56709 12.4062 8.56805 12.4054 8.56975C12.4045 8.57156 12.4023 8.57563 12.3975 8.58222C12.374 8.61504 12.3112 8.68009 12.1401 8.7957L12.1401 8.79568L12.1367 8.79797C12.1301 8.80253 12.1231 8.80731 12.1158 8.8123C11.7762 9.04508 10.75 9.74845 10.75 11.16V11.37C10.75 12.0024 11.2291 12.531 11.8414 12.6098C11.2183 12.688 10.75 13.2206 10.75 13.85C10.75 14.5318 11.2995 15.1 12 15.1C12.7005 15.1 13.25 14.5318 13.25 13.85C13.25 13.2206 12.7817 12.688 12.1586 12.6098C12.7709 12.531 13.25 12.0024 13.25 11.37V11.16C13.25 11.1259 13.2536 11.1116 13.2548 11.1077C13.2554 11.1054 13.2568 11.1004 13.2653 11.0885C13.2896 11.0546 13.3546 10.9878 13.5374 10.866Z" fill="white" stroke="white" />
                </svg>
              </Link>
            </Button>
          </div>
          <MostRead />
          <Button size="lg" className="mt-4 mx-auto md:hidden [@media(max-width:576px)]:w-full" asChild>
            <Link href="/questions">
              <h3>{t("all_questions")}</h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 18.43V17.93H7C5.61362 17.93 4.49716 17.47 3.72855 16.7014C2.95994 15.9328 2.5 14.8164 2.5 13.43V7.42999C2.5 6.04362 2.95994 4.92716 3.72855 4.15855C4.49716 3.38994 5.61362 2.92999 7 2.92999H17C18.3864 2.92999 19.5028 3.38994 20.2714 4.15855C21.0401 4.92716 21.5 6.04362 21.5 7.42999V13.43C21.5 14.8164 21.0401 15.9328 20.2714 16.7014C19.5028 17.47 18.3864 17.93 17 17.93H13H12.8489L12.7231 18.0137L8.27308 20.9737L8.27306 20.9737L8.26833 20.9769C7.94792 21.1953 7.5 20.9676 7.5 20.56V18.43ZM13.5374 10.866L13.5374 10.866L13.5404 10.864L13.55 10.8574C13.8726 10.6391 14.91 9.93682 14.91 8.52999C14.91 6.92385 13.6061 5.61999 12 5.61999C10.3939 5.61999 9.09 6.92385 9.09 8.52999C9.09 9.21613 9.65386 9.77999 10.34 9.77999C11.0261 9.77999 11.59 9.21613 11.59 8.52999C11.59 8.30613 11.7761 8.11999 12 8.11999C12.2239 8.11999 12.41 8.30613 12.41 8.52999C12.41 8.55593 12.4071 8.56533 12.4068 8.56625C12.4066 8.56709 12.4062 8.56805 12.4054 8.56975C12.4045 8.57156 12.4023 8.57563 12.3975 8.58222C12.374 8.61504 12.3112 8.68009 12.1401 8.7957L12.1401 8.79568L12.1367 8.79797C12.1301 8.80253 12.1231 8.80731 12.1158 8.8123C11.7762 9.04508 10.75 9.74845 10.75 11.16V11.37C10.75 12.0024 11.2291 12.531 11.8414 12.6098C11.2183 12.688 10.75 13.2206 10.75 13.85C10.75 14.5318 11.2995 15.1 12 15.1C12.7005 15.1 13.25 14.5318 13.25 13.85C13.25 13.2206 12.7817 12.688 12.1586 12.6098C12.7709 12.531 13.25 12.0024 13.25 11.37V11.16C13.25 11.1259 13.2536 11.1116 13.2548 11.1077C13.2554 11.1054 13.2568 11.1004 13.2653 11.0885C13.2896 11.0546 13.3546 10.9878 13.5374 10.866Z" fill="white" stroke="white" />
              </svg>
            </Link>
          </Button>
        </div>
      </section>

      <div className="relative bg-[#FDFBF6] bg-top z-[10]" style={{ backgroundImage: "url('/graphic2.png')" }}>
        <FatwasSection />

        <ArticlesSection />

        <BooksSection />

        <MediaSection className="relative z-[9]" />
      </div>

    </div>
  );
}
