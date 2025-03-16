"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import PocketBase from "pocketbase";
const pb = new PocketBase("https://back.fatvo.saidoff.uz");

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import CustomAudioPlayer from '@/components/CustomAudioPlyaer';

pb.autoCancellation(false)

const baseUrl = "https://back.fatvo.saidoff.uz/api/files/";

const getFileUrl = (collectionId, recordId, fileName) => {
  return `${baseUrl}${collectionId}/${recordId}/${fileName}`;
};

function MediaSection() {
  const t = useTranslations('')

  return (
    <section className="py-16 max-sm:py-8 bg-text relative overflow-hidden">
      <div
        className="w-[10px] h-[10px] bg-[#FBB04C33] top-0 left-0 absolute rounded-full"
        style={{ boxShadow: '0px 0px 400px 350px #FBB04C33' }}
      ></div>
      <div
        className="w-[10px] h-[10px] bg-[#FBB04C33] bottom-0 right-0 absolute rounded-full"
        style={{ boxShadow: '0px 0px 400px 350px #FBB04C33' }}
      ></div>
      <div
        className="w-[700px] h-[700px] max-sm:w-[400px] max-sm:h-[400px] max-sm:-translate-x-[100px] max-sm:-translate-y-[200px] -translate-x-[200px] -translate-y-[400px] z-[10] top-0 left-0 absolute rounded-full bg-no-repeat bg-cover"
        style={{ backgroundImage: 'url(/media-vector.png)' }}
      ></div>
      <div className="container flex flex-col relative z-[11]">
        <div className="flex items-end justify-between w-full mb-10 gap-4 max-sm:mb-5">
          <div>
            <h4 className="text-brand uppercase font-medium text-xl/[20px] [@media(max-width:576px)]:text-base/[16px]">{t('media')}</h4>
            <h3 className={`text-background mt-3 [@media(max-width:576px)]:mt-1 [@media(max-width:576px)]:text-[22px]/[28px] font-extrabold text-[40px]/[52px] -tracking-[0.64px] max-w-[750px]`}>{t("video_answers")}</h3>
          </div>
          <Button size="lg" className="max-md:hidden" asChild>
            <Link href="/media/videos">
              <h3>{t("all_video_answers")}</h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.76953 5.86V2.5H14.2295V5.86H9.76953Z" fill="white" stroke="white" />
                <path d="M21.2385 5.86H16.7305V2.51688C17.9626 2.59735 18.9615 2.96183 19.7149 3.54731C20.4277 4.10119 20.9496 4.87492 21.2385 5.86Z" fill="white" stroke="white" />
                <path d="M2 7.86011V16.1901C2 19.8301 4.17 22.0001 7.81 22.0001H16.19C19.83 22.0001 22 19.8301 22 16.1901V7.86011H2ZM14.44 16.1801L12.36 17.3801C11.92 17.6301 11.49 17.7601 11.09 17.7601C10.79 17.7601 10.52 17.6901 10.27 17.5501C9.69 17.2201 9.37 16.5401 9.37 15.6601V13.2601C9.37 12.3801 9.69 11.7001 10.27 11.3701C10.85 11.0301 11.59 11.0901 12.36 11.5401L14.44 12.7401C15.21 13.1801 15.63 13.8001 15.63 14.4701C15.63 15.1401 15.2 15.7301 14.44 16.1801Z" fill="white" />
                <path d="M7.77086 2C4.67086 2.01 2.64086 3.61 2.13086 6.36H7.77086V2Z" fill="white" />
              </svg>
            </Link>
          </Button>
        </div>
        <Videos />
        <Button size="lg" className="mx-auto md:hidden [@media(max-width:576px)]:w-full" asChild>
          <Link href="/media/videos">
            <h3>{t("all_video_answers")}</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.76953 5.86V2.5H14.2295V5.86H9.76953Z" fill="white" stroke="white" />
              <path d="M21.2385 5.86H16.7305V2.51688C17.9626 2.59735 18.9615 2.96183 19.7149 3.54731C20.4277 4.10119 20.9496 4.87492 21.2385 5.86Z" fill="white" stroke="white" />
              <path d="M2 7.86011V16.1901C2 19.8301 4.17 22.0001 7.81 22.0001H16.19C19.83 22.0001 22 19.8301 22 16.1901V7.86011H2ZM14.44 16.1801L12.36 17.3801C11.92 17.6301 11.49 17.7601 11.09 17.7601C10.79 17.7601 10.52 17.6901 10.27 17.5501C9.69 17.2201 9.37 16.5401 9.37 15.6601V13.2601C9.37 12.3801 9.69 11.7001 10.27 11.3701C10.85 11.0301 11.59 11.0901 12.36 11.5401L14.44 12.7401C15.21 13.1801 15.63 13.8001 15.63 14.4701C15.63 15.1401 15.2 15.7301 14.44 16.1801Z" fill="white" />
              <path d="M7.77086 2C4.67086 2.01 2.64086 3.61 2.13086 6.36H7.77086V2Z" fill="white" />
            </svg>
          </Link>
        </Button>
        <div className="flex items-end justify-between w-full mb-10 mt-16 max-lg:mt-8 max-lg:mb-5 max-md:mt-16">
          <div>
            <h3 className={`text-background mt-3 [@media(max-width:576px)]:mt-1 [@media(max-width:576px)]:text-[22px]/[28px] font-extrabold text-[40px]/[52px] -tracking-[0.64px] max-w-[750px]`}>{t("audio_answers")}</h3>
          </div>
          <Button size="lg" className="max-md:hidden" asChild>
            <Link href="/media/audios">
              <h3>{t("all_audio_answers")}</h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7997 19.1701V18.7132L11.3446 18.6721C7.60883 18.3351 4.67969 15.1979 4.67969 11.3901V9.81011C4.67969 9.69625 4.76583 9.61011 4.87969 9.61011C4.99354 9.61011 5.07969 9.69625 5.07969 9.81011V11.4001C5.07969 15.2162 8.18355 18.3201 11.9997 18.3201C15.8158 18.3201 18.9197 15.2162 18.9197 11.4001V9.82011C18.9197 9.70625 19.0058 9.62011 19.1197 9.62011C19.2197 9.62011 19.3142 9.70425 19.3197 9.8186V11.3901C19.3197 15.1985 16.3802 18.3445 12.6559 18.672L12.1997 18.7121V19.1701V21.3001C12.1997 21.414 12.1135 21.5001 11.9997 21.5001C11.8858 21.5001 11.7997 21.414 11.7997 21.3001V19.1701Z" fill="white" stroke="white" />
                <path d="M13.7929 9.07999L13.7929 9.07999L13.7942 9.07494C13.9117 8.61964 13.723 8.13733 13.338 7.88896C13.7585 7.87074 14.1477 7.61355 14.3082 7.18556L14.3083 7.18557L14.3095 7.18213C14.5181 6.61333 14.2118 6.00209 13.6622 5.80056L13.6613 5.80025C12.5926 5.41061 11.4136 5.40992 10.3445 5.79817C9.77506 5.99264 9.48698 6.6267 9.69064 7.18213C9.84518 7.6036 10.2418 7.87656 10.6697 7.89414C10.2898 8.13992 10.0849 8.6124 10.2178 9.08218C10.3686 9.65048 10.9492 10.009 11.5455 9.84133L11.5458 9.84122C11.8471 9.75626 12.1631 9.75626 12.4643 9.84122L12.483 9.84649L12.502 9.85029C12.5046 9.8508 12.5074 9.85137 12.5104 9.85198C12.5555 9.8611 12.6488 9.88 12.7501 9.88C13.2325 9.88 13.6632 9.56181 13.7929 9.07999ZM8.08008 6.42C8.08008 4.25614 9.83622 2.5 12.0001 2.5C14.1639 2.5 15.9201 4.25614 15.9201 6.42V11.54C15.9201 13.7039 14.1639 15.46 12.0001 15.46C9.83622 15.46 8.08008 13.7039 8.08008 11.54V6.42Z" fill="white" stroke="white" />
              </svg>
            </Link>
          </Button>
        </div>
        <Audios />
        <Button size="lg" className="mx-auto md:hidden [@media(max-width:576px)]:w-full" asChild>
          <Link href="/media/audios">
            <h3>{t("all_audio_answers")}</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7997 19.1701V18.7132L11.3446 18.6721C7.60883 18.3351 4.67969 15.1979 4.67969 11.3901V9.81011C4.67969 9.69625 4.76583 9.61011 4.87969 9.61011C4.99354 9.61011 5.07969 9.69625 5.07969 9.81011V11.4001C5.07969 15.2162 8.18355 18.3201 11.9997 18.3201C15.8158 18.3201 18.9197 15.2162 18.9197 11.4001V9.82011C18.9197 9.70625 19.0058 9.62011 19.1197 9.62011C19.2197 9.62011 19.3142 9.70425 19.3197 9.8186V11.3901C19.3197 15.1985 16.3802 18.3445 12.6559 18.672L12.1997 18.7121V19.1701V21.3001C12.1997 21.414 12.1135 21.5001 11.9997 21.5001C11.8858 21.5001 11.7997 21.414 11.7997 21.3001V19.1701Z" fill="white" stroke="white" />
              <path d="M13.7929 9.07999L13.7929 9.07999L13.7942 9.07494C13.9117 8.61964 13.723 8.13733 13.338 7.88896C13.7585 7.87074 14.1477 7.61355 14.3082 7.18556L14.3083 7.18557L14.3095 7.18213C14.5181 6.61333 14.2118 6.00209 13.6622 5.80056L13.6613 5.80025C12.5926 5.41061 11.4136 5.40992 10.3445 5.79817C9.77506 5.99264 9.48698 6.6267 9.69064 7.18213C9.84518 7.6036 10.2418 7.87656 10.6697 7.89414C10.2898 8.13992 10.0849 8.6124 10.2178 9.08218C10.3686 9.65048 10.9492 10.009 11.5455 9.84133L11.5458 9.84122C11.8471 9.75626 12.1631 9.75626 12.4643 9.84122L12.483 9.84649L12.502 9.85029C12.5046 9.8508 12.5074 9.85137 12.5104 9.85198C12.5555 9.8611 12.6488 9.88 12.7501 9.88C13.2325 9.88 13.6632 9.56181 13.7929 9.07999ZM8.08008 6.42C8.08008 4.25614 9.83622 2.5 12.0001 2.5C14.1639 2.5 15.9201 4.25614 15.9201 6.42V11.54C15.9201 13.7039 14.1639 15.46 12.0001 15.46C9.83622 15.46 8.08008 13.7039 8.08008 11.54V6.42Z" fill="white" stroke="white" />
            </svg>
          </Link>
        </Button>
      </div>
    </section>
  )
}

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const getVideos = async () => {
    setIsLoading(true);
    try {

      const resultList = await pb.collection('medias').getList(1, 3, {
        sort: '-created',
        filter: "type = 'video'",
        fields: "title,id,created,mid,link"
      });

      setVideos(resultList.items);
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getVideos();
  }, []);


  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }

  if (!videos.length) {
    return (
      <div className='flex items-center justify-center min-h-[200px] text-sm font-semibold text-[#9E9996] select-none'>{t('empty')}</div>
    )
  }

  return (
    <div className="flex flex-col justify-between">
      <ul className='grid grid-cols-3 [@media(max-width:992px)]:grid-cols-2 max-sm:!grid-cols-1 gap-6 mb-8 max-sm:mb-6'>
        {videos.map((_, index) => (
          <li key={index} className='bg-background rounded-[20px] overflow-hidden flex flex-col justify-between'>
            <iframe
              className='aspect-[380/234]'
              width="100%"
              height="auto"
              src={`${_.link}?enablejsapi=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            >
            </iframe>
            <div className='p-4 flex flex-col grow justify-between gap-2'>
              <h3 className='text-text font-bold text-lg/[23px] line-clamp-2'>{_.title}</h3>
              <div className='flex items-center justify-between border-t border-t-[#D9D2CE] pt-2'>
                <h3 className='text-brand flex items-center gap-1'>ID: <span className='text-[#9E9996]'>{_.mid}</span></h3>
                <h3 className='text-brand flex items-center gap-1'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                  </svg>
                  <span className='text-[#9E9996]'>{formatDate(_.created)}</span>
                </h3>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Audios = () => {
  const [audios, setAudios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const getAudios = async () => {
    setIsLoading(true);
    try {

      const resultList = await pb.collection('medias').getList(1, 4, {
        sort: '-created',
        filter: "type = 'audio'",
        fields: "title,id,collectionId,mid,created,file"
      });

      setAudios(resultList.items);
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAudios();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }

  if (!audios.length) {
    return (
      <div className='flex items-center justify-center min-h-[200px] text-sm font-semibold text-[#9E9996] select-none'>{t('empty')}</div>
    )
  }

  return (
    <div className="flex flex-col justify-between">
      <div className='max-sm:mb-6 mb-8'>
        <Swiper className="w-full"
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
          {audios.map((_, index) => (
            <SwiperSlide key={index} className='bg-background w-full rounded-[20px] overflow-hidden flex flex-col justify-between'>
              <li className='bg-background rounded-[20px] overflow-hidden flex flex-col justify-between'>
                <CustomAudioPlayer
                  onPlay={() => handlePlay}
                  src={getFileUrl(_.collectionId, _.id, _.file)}
                  cover="/audio.png"
                />
                <div className='p-4 flex flex-col grow justify-between gap-2'>
                  <h3 className='text-text font-bold text-lg/[23px] line-clamp-2'>{_.title}</h3>
                  <div className='flex items-center justify-between border-t border-t-[#D9D2CE] pt-2'>
                    <h3 className='text-brand text-sm flex items-center gap-1'>ID: <span className='text-[#9E9996]'>{_.mid}</span></h3>
                    <h3 className='text-brand flex text-sm items-center gap-1'>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                      </svg>
                      <span className='text-[#9E9996]'>{formatDate(_.created)}</span>
                    </h3>
                  </div>
                </div>
              </li>
            </SwiperSlide>
          ))}
        </Swiper>


      </div>
    </div>
  )
}

export default MediaSection;