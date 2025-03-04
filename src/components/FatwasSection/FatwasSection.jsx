"use client"

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import styles from './FatwasSection.module.scss'
import PocketBase from "pocketbase";
const pb = new PocketBase("https://back.fatvo.saidoff.uz");
const baseUrl = "https://back.fatvo.saidoff.uz/api/files/";

const getFileUrl = (collectionId, recordId, fileName) => {
  return `${baseUrl}${collectionId}/${recordId}/${fileName}`;
};

function FatwasSection() {
  const t = useTranslations('')
  const locale = useLocale();

  const title = {
    uz: {
      title: "Musulmonlar idorasi tomonidan berilgan <span>Fatvolar</span>",
    },
    ru: {
      title: "<span>Фатвы</span>, выданные управлением мусульман",
    },
    en: {
      title: "<span>Fatwas</span> issued by the Muslim authority",
    },
  }

  return (
    <section className="py-16 max-sm:py-8 bg-[#FBB04C1F] max-md:bg-transparent">
      <div className="container flex flex-col">
        <div className="flex items-end justify-between w-full mb-10 gap-4 max-sm:mb-5">
          <div>
            <h4 className="text-brand uppercase font-medium text-xl/[20px] [@media(max-width:576px)]:text-base/[16px]">{t('fatwas')}</h4>
            <h3 className={`${styles.title} [@media(max-width:576px)]:mt-1 [@media(max-width:576px)]:text-[22px]/[28px] font-extrabold text-[40px]/[52px] -tracking-[0.64px] max-w-[750px]`} dangerouslySetInnerHTML={{ __html: title[locale].title }}></h3>
          </div>
          <Button size="lg" className="max-md:hidden" asChild>
            <Link href="/fatwas">
              <h3>{t("all_fatwas")}</h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.03008 16.9495L5.03009 16.9495L5.0278 16.9478C4.78433 16.768 4.53448 16.4517 4.34451 16.0707C4.15473 15.69 4.05078 15.2969 4.05078 14.99V6.89003C4.05078 6.44643 4.22243 5.95142 4.52419 5.51615C4.82577 5.08114 5.22976 4.74555 5.64676 4.58804C5.64694 4.58797 5.64713 4.5879 5.64731 4.58783L11.1436 2.5292C11.144 2.52906 11.1444 2.52891 11.1448 2.52877C11.3577 2.45058 11.6694 2.40253 12.0058 2.40253C12.3421 2.40253 12.6539 2.45058 12.8668 2.52877C12.8672 2.52891 12.8675 2.52906 12.8679 2.5292L18.3628 4.58727C18.3632 4.58743 18.3636 4.58758 18.364 4.58774C18.7758 4.74497 19.1773 5.08011 19.4764 5.51476C19.7759 5.94984 19.9447 6.44369 19.9408 6.8856L19.9408 6.8856V6.89003V14.99C19.9408 15.2966 19.8371 15.6869 19.6473 16.0664C19.4579 16.4453 19.2075 16.7638 18.9607 16.9501C18.9604 16.9503 18.9601 16.9505 18.9598 16.9508L13.4615 21.0595L13.4601 21.0605C13.0768 21.349 12.5477 21.5075 11.9958 21.5075C11.4438 21.5075 10.9148 21.349 10.5314 21.0605L10.5301 21.0595L5.03008 16.9495ZM14.0772 8.29647L10.6608 11.7129L9.93433 10.9865C9.44907 10.5012 8.65249 10.5012 8.16723 10.9865C7.68237 11.4713 7.68197 12.267 8.16601 12.7524C8.16642 12.7528 8.16682 12.7532 8.16723 12.7536L9.76504 14.3714L9.76503 14.3714L9.76723 14.3736C10.0159 14.6223 10.3353 14.74 10.6508 14.74C10.9662 14.74 11.2856 14.6223 11.5343 14.3736L15.8317 10.0762C16.3306 9.59022 16.3294 8.78158 15.8443 8.29647C15.3591 7.81121 14.5625 7.81121 14.0772 8.29647Z" fill="white" stroke="white" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
      <Fatwas />
      <div className="px-3 mt-4 flex justify-between">
        <Button size="lg" className="mx-auto md:hidden [@media(max-width:576px)]:w-full" asChild>
          <Link href="/fatwas">
            <h3>{t("all_fatwas")}</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.03008 16.9495L5.03009 16.9495L5.0278 16.9478C4.78433 16.768 4.53448 16.4517 4.34451 16.0707C4.15473 15.69 4.05078 15.2969 4.05078 14.99V6.89003C4.05078 6.44643 4.22243 5.95142 4.52419 5.51615C4.82577 5.08114 5.22976 4.74555 5.64676 4.58804C5.64694 4.58797 5.64713 4.5879 5.64731 4.58783L11.1436 2.5292C11.144 2.52906 11.1444 2.52891 11.1448 2.52877C11.3577 2.45058 11.6694 2.40253 12.0058 2.40253C12.3421 2.40253 12.6539 2.45058 12.8668 2.52877C12.8672 2.52891 12.8675 2.52906 12.8679 2.5292L18.3628 4.58727C18.3632 4.58743 18.3636 4.58758 18.364 4.58774C18.7758 4.74497 19.1773 5.08011 19.4764 5.51476C19.7759 5.94984 19.9447 6.44369 19.9408 6.8856L19.9408 6.8856V6.89003V14.99C19.9408 15.2966 19.8371 15.6869 19.6473 16.0664C19.4579 16.4453 19.2075 16.7638 18.9607 16.9501C18.9604 16.9503 18.9601 16.9505 18.9598 16.9508L13.4615 21.0595L13.4601 21.0605C13.0768 21.349 12.5477 21.5075 11.9958 21.5075C11.4438 21.5075 10.9148 21.349 10.5314 21.0605L10.5301 21.0595L5.03008 16.9495ZM14.0772 8.29647L10.6608 11.7129L9.93433 10.9865C9.44907 10.5012 8.65249 10.5012 8.16723 10.9865C7.68237 11.4713 7.68197 12.267 8.16601 12.7524C8.16642 12.7528 8.16682 12.7532 8.16723 12.7536L9.76504 14.3714L9.76503 14.3714L9.76723 14.3736C10.0159 14.6223 10.3353 14.74 10.6508 14.74C10.9662 14.74 11.2856 14.6223 11.5343 14.3736L15.8317 10.0762C16.3306 9.59022 16.3294 8.78158 15.8443 8.29647C15.3591 7.81121 14.5625 7.81121 14.0772 8.29647Z" fill="white" stroke="white" />
            </svg>
          </Link>
        </Button>
      </div>
    </section>
  )
}

const Fatwas = () => {
  const [fatwas, setFatwas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const getFatwas = async () => {
    setIsLoading(true);
    try {
      const resultList = await pb.collection('fatwas').getList(1, 6, {
        sort: '-created',
      });


      setFatwas(resultList.items);
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getFatwas();
  }, []);


  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }

  if (!fatwas.length) {
    return (
      <div className='flex items-center justify-center min-h-[200px] text-sm font-semibold text-[#9E9996] select-none'>{t('empty')}</div>
    )
  }

  return (
    <div className="overflow-hidden w-full relative">
      <div className="absolute top-0 right-0 h-full z-[10] [@media(max-width:768px)]:hidden w-[150px] max-lg:w-[50px] bg-gradient-to-l from-[#FDFBF6] to-[#FDFBF600]"></div>
      <div className="container">
        <Swiper className="!overflow-visible w-full max-md:!hidden"
          spaceBetween={24}
          slidesPerView={4}
          breakpoints={{
            1: { slidesPerView: 1 },
            768: { slidesPerView: 1.1, spaceBetween: 24 },
          }}
        >
          {fatwas.map((_, index) => (
            <SwiperSlide key={index} className='bg-background rounded-[20px] overflow-hidden flex flex-col justify-between relative'>
              <div className="absolute w-full h-full">
                <img loading="lazy" className="aspect-[379/200] [@media(max-width:576px)]:aspect-[343/200] object-cover w-full h-full" src={getFileUrl(_.collectionId, _.id, _.files)}
                  alt={`img ${_.id}`} />
              </div>
              <div className='aspect-[379/200] w-full h-full justify-end flex flex-col relative z-[10]'>
                <div className='p-9 flex flex-col justify-between gap-2'>
                  <h3 className='text-background font-bold text-[32px]/[41px] [@media(max-width:576px)]:text-base/[21px] line-clamp-2'>{_.title}</h3>
                  <div className='flex items-center gap-3 mt-2'>
                    <h3 className='text-brand text-sm flex items-center gap-1'>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                      </svg>
                      <span className='text-background'>{formatDate(_.created)}</span>
                    </h3>
                    <h3 className='text-brand text-sm flex items-center gap-1'>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3866 7.99995C10.3866 9.31995 9.31995 10.3866 7.99995 10.3866C6.67995 10.3866 5.61328 9.31995 5.61328 7.99995C5.61328 6.67995 6.67995 5.61328 7.99995 5.61328C9.31995 5.61328 10.3866 6.67995 10.3866 7.99995Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1266 14.0732 9.72665C14.6732 8.78665 14.6732 7.20665 14.0732 6.26665C12.5466 3.86665 10.3532 2.47998 7.9999 2.47998C5.64656 2.47998 3.45323 3.86665 1.92656 6.26665C1.32656 7.20665 1.32656 8.78665 1.92656 9.72665C3.45323 12.1266 5.64656 13.5133 7.9999 13.5133Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className='text-background'>{_.views}</span>
                    </h3>
                  </div>
                  <Link href={`/fatwas/${_.id}`} className="mt-[14px] flex items-center gap-2.5 py-3 px-[22px] w-fit bg-[#FFFFFF1F] rounded-[10px]">
                    <h3 className="text-background leading-[26px]">Batafsil</h3>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.4297 5.93005L20.4997 12.0001L14.4297 18.0701" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>
        <ul className='md:hidden grid gap-6 mb-8 max-md:mb-4 sm:grid-cols-2 
            [@media(min-width:577px)]:grid-cols-2 
            [@media(min-width:992px)]:grid-cols-3'>
          {fatwas.map((_, index) => (
            <li key={index} className='bg-background rounded-[20px] overflow-hidden flex flex-col justify-between'>
              <Link href={`/fatwas/${_.id}`} className='w-full h-full justify-between flex flex-col'>
                <div className="bg-[#FBB04C]">
                  <img className="aspect-[379/200] [@media(max-width:576px)]:aspect-[343/200] object-contain" src={getFileUrl(_.collectionId, _.id, _.files)}
                    alt={`img ${_.id}`} />
                </div>
                <div className='p-4 flex flex-col grow justify-between gap-2'>
                  <h3 className='text-text font-bold text-lg/[23px] [@media(max-width:576px)]:text-base/[21px] line-clamp-2'>{_.title}</h3>
                  <div className='flex items-center justify-between border-t border-t-[#D9D2CE] pt-2'>
                    <h3 className='text-brand text-sm flex items-center gap-1'>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                      </svg>
                      <span className='text-[#9E9996]'>{formatDate(_.created)}</span>
                    </h3>
                    <h3 className='text-brand text-sm flex items-center gap-1'>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3866 7.99995C10.3866 9.31995 9.31995 10.3866 7.99995 10.3866C6.67995 10.3866 5.61328 9.31995 5.61328 7.99995C5.61328 6.67995 6.67995 5.61328 7.99995 5.61328C9.31995 5.61328 10.3866 6.67995 10.3866 7.99995Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1266 14.0732 9.72665C14.6732 8.78665 14.6732 7.20665 14.0732 6.26665C12.5466 3.86665 10.3532 2.47998 7.9999 2.47998C5.64656 2.47998 3.45323 3.86665 1.92656 6.26665C1.32656 7.20665 1.32656 8.78665 1.92656 9.72665C3.45323 12.1266 5.64656 13.5133 7.9999 13.5133Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className='text-[#9E9996]'>{_.views}</span>
                    </h3>
                  </div>
                </div>
              </Link>

            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


export default FatwasSection;