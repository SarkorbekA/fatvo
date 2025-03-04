"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import PocketBase from "pocketbase";
const pb = new PocketBase("https://back.fatvo.saidoff.uz");
const baseUrl = "https://back.fatvo.saidoff.uz/api/files/";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

const getFileUrl = (collectionId, recordId, fileName) => {
  return `${baseUrl}${collectionId}/${recordId}/${fileName}`;
};

function ArticlesSection() {
  const t = useTranslations('')

  return (
    <section className="py-16 max-sm:py-8">
      <div className="container flex flex-col">
        <div className="flex items-end justify-between w-full mb-10 max-sm:mb-5">
          <div>
            <h4 className="text-brand uppercase font-medium text-xl/[20px] [@media(max-width:576px)]:text-base/[16px]">{t('articles')}</h4>
            <h3 className="mt-3  [@media(max-width:576px)]:mt-1 [@media(max-width:576px)]:text-[22px]/[28px] font-extrabold text-[40px]/[52px] -tracking-[0.64px] max-w-[750px]">{t("most_read_articles")}</h3>
          </div>
          <Button size="lg" asChild className="max-md:hidden">
            <Link href="/articles">
              <h3>{t("all_articles")}</h3>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 2.5H16.5C18.1547 2.5 19.2543 2.97026 19.9461 3.71523C20.6441 4.4669 21 5.57665 21 7V17C21 18.4234 20.6441 19.5331 19.9461 20.2848C19.2543 21.0297 18.1547 21.5 16.5 21.5H8.5C6.8453 21.5 5.74565 21.0297 5.0539 20.2848C4.35591 19.5331 4 18.4234 4 17V7C4 5.57665 4.35591 4.4669 5.0539 3.71523C5.74565 2.97026 6.8453 2.5 8.5 2.5ZM12.5 11.75H8.5C7.81386 11.75 7.25 12.3139 7.25 13C7.25 13.6861 7.81386 14.25 8.5 14.25H12.5C13.1861 14.25 13.75 13.6861 13.75 13C13.75 12.3139 13.1861 11.75 12.5 11.75ZM8.5 18.25H16.5C17.1861 18.25 17.75 17.6861 17.75 17C17.75 16.3139 17.1861 15.75 16.5 15.75H8.5C7.81386 15.75 7.25 16.3139 7.25 17C7.25 17.6861 7.81386 18.25 8.5 18.25ZM17 9.75H19C19.6861 9.75 20.25 9.18614 20.25 8.5C20.25 7.81386 19.6861 7.25 19 7.25H17C16.5861 7.25 16.25 6.91386 16.25 6.5V4.5C16.25 3.81386 15.6861 3.25 15 3.25C14.3139 3.25 13.75 3.81386 13.75 4.5V6.5C13.75 8.29614 15.2039 9.75 17 9.75Z" fill="white" stroke="white" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
      <Articles />
      <div className="px-3 mt-4 flex justify-between">
        <Button size="lg" asChild className="mx-auto md:hidden [@media(max-width:576px)]:w-full">
          <Link href="/articles">
            <h3>{t("all_articles")}</h3>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 2.5H16.5C18.1547 2.5 19.2543 2.97026 19.9461 3.71523C20.6441 4.4669 21 5.57665 21 7V17C21 18.4234 20.6441 19.5331 19.9461 20.2848C19.2543 21.0297 18.1547 21.5 16.5 21.5H8.5C6.8453 21.5 5.74565 21.0297 5.0539 20.2848C4.35591 19.5331 4 18.4234 4 17V7C4 5.57665 4.35591 4.4669 5.0539 3.71523C5.74565 2.97026 6.8453 2.5 8.5 2.5ZM12.5 11.75H8.5C7.81386 11.75 7.25 12.3139 7.25 13C7.25 13.6861 7.81386 14.25 8.5 14.25H12.5C13.1861 14.25 13.75 13.6861 13.75 13C13.75 12.3139 13.1861 11.75 12.5 11.75ZM8.5 18.25H16.5C17.1861 18.25 17.75 17.6861 17.75 17C17.75 16.3139 17.1861 15.75 16.5 15.75H8.5C7.81386 15.75 7.25 16.3139 7.25 17C7.25 17.6861 7.81386 18.25 8.5 18.25ZM17 9.75H19C19.6861 9.75 20.25 9.18614 20.25 8.5C20.25 7.81386 19.6861 7.25 19 7.25H17C16.5861 7.25 16.25 6.91386 16.25 6.5V4.5C16.25 3.81386 15.6861 3.25 15 3.25C14.3139 3.25 13.75 3.81386 13.75 4.5V6.5C13.75 8.29614 15.2039 9.75 17 9.75Z" fill="white" stroke="white" />
            </svg>
          </Link>
        </Button>
      </div>
    </section>
  )
}

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const getArticles = async () => {
    setIsLoading(true);
    try {
      const resultList = await pb.collection('articles').getList(1, 8, {
        sort: '-created',
        expand: "category"
      });

      setArticles(resultList.items);
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getArticles();
  }, []);


  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }

  if (!articles.length) {
    return (
      <div className='flex items-center justify-center min-h-[200px] text-sm font-semibold text-[#9E9996] select-none'>{t('empty')}</div>
    )
  }

  return (
    <div className="overflow-hidden w-full relative">
      <div className="absolute top-0 right-0 h-full z-[10] [@media(max-width:380px)]:hidden w-[150px] bg-gradient-to-l from-[#FDFBF6] to-[#FDFBF600]"></div>
      <div className="container">
        <Swiper className="h-[364px] [@media(max-width:380px)]:h-[340px] !overflow-visible w-full"
          spaceBetween={24}
          slidesPerView={4}
          breakpoints={{
            1: { slidesPerView: 1 },
            380: { slidesPerView: 1.4 },
            576: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {articles.map((_, index) => (
            <SwiperSlide key={index} className='bg-background w-full rounded-[20px] overflow-hidden flex flex-col justify-between'>
              <Link href={`/articles/${_.id}`} className='w-full h-full justify-between flex flex-col'>
                <div>
                  <img loading="lazy" src={getFileUrl(_.collectionId, _.id, _.files)}
                    alt={`img ${_.id}`} />
                </div>
                <div className="grow flex flex-col justify-between gap-2 p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#FBB04C] font-medium max-sm:text-sm/[14px]">
                      {_.expand.category.name}
                    </h3>
                    <h3 className="text-text font-bold line-clamp-2 text-lg/[23px] max-sm:text-base/[21px]">
                      {_.title}
                    </h3>
                    <p
                      className={`line-clamp-3 text-sm/[18px] text-[#9E9996]`}
                      dangerouslySetInnerHTML={{ __html: _.description }}
                    />
                  </div>
                  <div className='flex justify-between pt-1 items-center'>
                    <h3 className='text-brand flex items-center gap-1 border border-[#D9D2CE] rounded-lg py-[5px] px-2'>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                      </svg>
                      <span className='text-[#9E9996] text-xs/[12px]'>{formatDate(_.created)}</span>
                    </h3>
                    <h3 className='text-brand flex items-center gap-1 border border-[#D9D2CE] rounded-lg py-[5px] px-2'>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3866 8.00001C10.3866 9.32001 9.31995 10.3867 7.99995 10.3867C6.67995 10.3867 5.61328 9.32001 5.61328 8.00001C5.61328 6.68001 6.67995 5.61334 7.99995 5.61334C9.31995 5.61334 10.3866 6.68001 10.3866 8.00001Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1266 14.0732 9.72665C14.6732 8.78665 14.6732 7.20665 14.0732 6.26665C12.5466 3.86665 10.3532 2.47998 7.9999 2.47998C5.64656 2.47998 3.45323 3.86665 1.92656 6.26665C1.32656 7.20665 1.32656 8.78665 1.92656 9.72665C3.45323 12.1266 5.64656 13.5133 7.9999 13.5133Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className='text-[#9E9996] text-xs/[12px]'>{_.views}</span>
                    </h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}


export default ArticlesSection;