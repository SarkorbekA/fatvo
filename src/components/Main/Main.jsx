'use client';

import { useTranslations } from 'next-intl';

import { useState, useEffect } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import PocketBase from 'pocketbase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
const pb = new PocketBase("https://back.fatvo.saidoff.uz");
import axios from 'axios';
import { useLocale } from "next-intl";
import { toHijri } from 'hijri-converter';

export default function Main() {
  const t = useTranslations('')
  const [prayerTimes, setPrayerTimes] = useState({})
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");

  const locale = useLocale()
  const router = useRouter();

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault()

    router.push(`/questions?search=${search.toString()}`);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    if (nextPrayer) {
      const interval = setInterval(() => {
        updateRemainingTime(nextPrayer.time);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextPrayer]);

  const getNextPrayer = (prayerTimes) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const formattedTimes = Object.entries(prayerTimes)
      .filter(([key]) => !["midnight", "imsak", "date"].includes(key))
      .map(([key, time]) => {
        const [hours, minutes] = time.split(":");
        const prayerTime = new Date(today);
        prayerTime.setHours(hours, minutes, 0, 0);

        return {
          name: key,
          time: prayerTime,
        };
      });

    return formattedTimes.find(({ time }) => time > now) || null;
  };

  const updateRemainingTime = (prayerTime) => {
    const now = new Date();
    const diff = prayerTime - now;

    if (diff <= 0) {
      setTimeRemaining("00:00:00");
      setNextPrayer(getNextPrayer(prayerTimes));
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeRemaining(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
  };

  const getPrayerTimes = async () => {
    const defaultCoords = { lat: 41.33403312669235, lon: 69.24261101722132 };
    const date = new Date().toLocaleDateString("en-GB").split('/').join('-');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const res = await axios.get(`https://back.fatvo.saidoff.uz/api/v1/prayer-times/location-date?lat=${latitude}&lon=${longitude}&date=${date}`);

      const filteredData = Object.fromEntries(
        Object.entries(res.data).filter(
          ([key]) => !["midnight", "imsak", "date"].includes(key)
        )
      );

      setPrayerTimes(filteredData);
      const next = getNextPrayer(filteredData);
      setNextPrayer(next);

      if (next) updateRemainingTime(next.time);
    } catch (e) {
      console.log("Не удалось получить местоположение, используются координаты по умолчанию.");
      const res = await axios.get(`https://back.fatvo.saidoff.uz/api/v1/prayer-times/location-date?lat=${defaultCoords.lat}&lon=${defaultCoords.lon}&date=${date}`);

      const filteredData = Object.fromEntries(
        Object.entries(res.data).filter(([key]) => !["midnight", "imsak", "date"].includes(key))
      );

      setPrayerTimes(filteredData);
      const next = getNextPrayer(filteredData);
      setNextPrayer(next);

      if (next) updateRemainingTime(next.time);
    }
  };

  const getFormattedDate = (locale = 'uz') => {
    const today = new Date();

    const weekdays = {
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
    };

    const months = {
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr']
    };

    const day = today.getDate();
    const month = months[locale][today.getMonth()];
    const dayOfWeek = weekdays[locale][today.getDay()];
    const year = today.getFullYear();

    return `${day} ${month}, ${dayOfWeek.toLowerCase()} (${year})`;
  };
  const getHijriDate = () => {
    const today = new Date();

    const hijriDate = toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qidah', 'Dhu al-Hijjah'
    ];

    const hijriFormattedDate = `${hijriDate.hd} ${hijriMonths[hijriDate.hm - 1]} ${hijriDate.hy}`;


    return `${hijriFormattedDate}`;
  }

  useEffect(() => {
    getPrayerTimes()
  }, [])

  return (
    <section className="pt-[180px] -mt-[90px] relative overflow-hidden pb-[175px] max-sm:pt-[122px] max-sm:pb-[120px] bg-no-repeat bg-contain bg-left-bottom">
      <div className="z-[10] absolute top-0 right-0 w-[1200px] max-md:w-[900px] max-sm:w-[500px] max-md:-right-[40px] max-md:h-[670px] max-md:bg-contain max-md:top-auto max-md:-bottom-[80px] max-sm:-bottom-[140px] h-full bg-[url('/masjid2.png')] bg-cover bg-no-repeat bg-center"></div>
      <div className="z-[9] absolute bottom-0 left-0 bg-[url('/graphic1.png')] bg-no-repeat bg-left-bottom bg-cover w-[800px] h-[800px] max-md:h-[500px] max-md:w-[500px] max-sm:w-[350px] max-sm:h-[350px]"></div>

      <div className="container relative z-[10]">
        <div className="bg-[#FFFFFFBF] backdrop-blur-lg rounded-[32px] p-10 [@media(max-width:576px)]:p-4" style={{
          boxShadow: "0px 12px 32px 0px #4215040F"
        }} >
          <div className='flex items-start justify-between gap-4 max-md:flex-col'>
            <h3 className='text-text font-extrabold text-[40px]/[52px] [@media(max-width:576px)]:text-[24px]/[31px] tracking-[0.64px]'>{t("questions_that_interest_you")}
              <span className='text-brand block'>{t("get_an_answer")}</span>
            </h3>
            <Button className="py-4 w-fit px-5 [@media(max-width:576px)]:hidden" asChild>
              <Link href={`/ask`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.1901 8.0399L18.0101 4.85991C16.8101 3.65991 15.1601 3.71993 14.3501 5.00993L12.5801 7.80992L18.2501 13.4799L21.0501 11.7099C22.2601 10.9399 22.3301 9.1699 21.1901 8.0399Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.2506 13.4697L18.4906 17.5897C18.7206 19.8897 17.9206 20.6897 15.7406 20.9497L7.0206 21.9797C5.1806 22.1897 3.8606 20.8698 4.0806 19.0398L5.06059 10.7598" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12.5801 7.81018L10.8301 7.7002" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.28125 20.7799L8.46126 17.5898" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 6.5C11 6.91 10.94 7.32001 10.83 7.70001C10.72 8.10001 10.56 8.47001 10.35 8.82001C10.11 9.22001 9.81001 9.58 9.46001 9.88C8.67001 10.58 7.64 11 6.5 11C5.99 11 5.51 10.92 5.06 10.76C4.04 10.42 3.18999 9.72001 2.64999 8.82001C2.23999 8.14001 2 7.34 2 6.5C2 5.08 2.65 3.80999 3.69 2.98999C4.46 2.36999 5.44 2 6.5 2C8.99 2 11 4.01 11 6.5Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.52148 8.17981V4.81982" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.16078 6.5H4.80078" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="font-semibold text-xl/[24px]">{t('ask-question')}</h3>
              </Link>
            </Button>
          </div>
          <form onSubmit={(e) => handleSearch(e)} className='mt-8 [@media(max-width:576px)]:mt-5 flex items-center gap-2'>
            <div className='grow relative'>
              <Input value={search} onChange={(e) => handleInputChange(e)} required className="px-5 max-sm:py-3.5 py-[18px]" placeholder={t("enter_your_question")} type="text" />
              <button type="submit" className='[@media(min-width:576px)]:hidden cursor-pointer absolute top-1/2 -translate-y-1/2 right-4'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 22L20 20" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <Button type="submit" className="font-medium py-4 px-5 leading-[20px] [@media(max-width:576px)]:hidden" style={{
              background: "linear-gradient(258.01deg, #E28810 4.48%, #FBB04C 100%)"
            }}>{t("search")}</Button>
          </form>
          {Object.keys(prayerTimes).length > 0 && (
            <ul className='mt-10 sm:hidden max-sm:flex max-sm:gap-x-3 max-sm:gap-y-2 max-sm:flex-wrap max-sm:justify-center'>
              {Object.entries(prayerTimes).map(([key, time]) => (
                <li
                  key={key}
                  style={{
                    boxShadow: nextPrayer?.name === key ? "0px 12px 32px 0px #4215040F" : "0px 4px 24px 0px #4215041C",
                  }}
                  className={`${nextPrayer?.name === key ? "border-[#FBB04C] bg-[#FBB04C14]" : "border-background bg-background"} border flex flex-col gap-2 items-center rounded-lg max-sm:px-5 max-sm:flex-row max-sm:py-3.5 [@media(max-width:375px)]:justify-center [@media(max-width:375px)]:w-full`}
                >
                  <h3 className='text-xl/[20px] max-sm:text-sm/[14px]'> {t(key)}
                    <span className='sm:hidden'>:</span>
                  </h3>
                  <span className="text-brand text-[32px]/[32px] max-sm:text-base/[16px] font-bold">{time}</span>
                </li>
              ))}
            </ul>
          )}
          <div className='mt-10 max-sm:mt-6 flex flex-col items-center'>
            <h3 className='text-[#42150480] font-semibold text-[24px]/[34px] [@media(max-width:576px)]:text-[20px]/[28px] text-center'>{getFormattedDate()}</h3>
            <h3 className='text-[#13060152] font-medium text-[20px]/[28px] [@media(max-width:576px)]:text-[16px]/[22px] text-center'>{getHijriDate()}</h3>
          </div>
          <Button variant="outline" className="py-4 [@media(max-width:576px)]:py-3 w-full mt-10 px-5 [@media(min-width:576px)]:hidden" asChild>
            <Link href={`/ask`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.1901 8.0399L18.0101 4.85991C16.8101 3.65991 15.1601 3.71993 14.3501 5.00993L12.5801 7.80992L18.2501 13.4799L21.0501 11.7099C22.2601 10.9399 22.3301 9.1699 21.1901 8.0399Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.2506 13.4697L18.4906 17.5897C18.7206 19.8897 17.9206 20.6897 15.7406 20.9497L7.0206 21.9797C5.1806 22.1897 3.8606 20.8698 4.0806 19.0398L5.06059 10.7598" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5801 7.81018L10.8301 7.7002" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.28125 20.7799L8.46126 17.5898" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 6.5C11 6.91 10.94 7.32001 10.83 7.70001C10.72 8.10001 10.56 8.47001 10.35 8.82001C10.11 9.22001 9.81001 9.58 9.46001 9.88C8.67001 10.58 7.64 11 6.5 11C5.99 11 5.51 10.92 5.06 10.76C4.04 10.42 3.18999 9.72001 2.64999 8.82001C2.23999 8.14001 2 7.34 2 6.5C2 5.08 2.65 3.80999 3.69 2.98999C4.46 2.36999 5.44 2 6.5 2C8.99 2 11 4.01 11 6.5Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.52148 8.17981V4.81982" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.16078 6.5H4.80078" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="font-semibold text-xl/[24px]">{t('ask-question')}</h3>
            </Link>
          </Button>
        </div>

        {Object.keys(prayerTimes).length > 0 && (
          <div className="max-sm:hidden bg-[#FFFFFFBF] backdrop-blur-lg rounded-[32px] p-6 [@media(max-width:576px)]:p-4 mt-4" style={{
            boxShadow: "0px 12px 32px 0px #4215040F"
          }} >
            <ul className='grid grid-cols-6 max-lg:grid-cols-4 max-md:grid-cols-3 max-lg:gap-5 gap-6 max-sm:flex max-sm:gap-x-3 max-sm:gap-y-2 max-sm:flex-wrap max-sm:justify-center'>
              {Object.entries(prayerTimes).map(([key, time]) => (
                <li
                  key={key}
                  style={{
                    boxShadow: nextPrayer?.name === key ? "0px 12px 32px 0px #4215040F" : "0px 4px 24px 0px #4215041C",
                  }}
                  className={`${nextPrayer?.name === key ? "border-[#FBB04C] bg-[#FBB04C14]" : "border-background bg-background"} relative border pb-5 pt-3 flex flex-col gap-2 items-center rounded-lg max-sm:px-5 max-sm:flex-row max-sm:py-4 [@media(max-width:375px)]:justify-center [@media(max-width:375px)]:w-full`}
                >
                  <div className='w-[46px] h-[46px] flex items-center justify-center max-sm:hidden'>
                    {key == 'fajr' && <svg fill={nextPrayer?.name === "fajr" ? "#FBB04C" : "#9E9996"} width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
                      <path d="M45.0416 37.4352H0.958363C0.429094 37.4352 0 37.0062 0 36.4769C0 35.9476 0.429094 35.5185 0.958363 35.5185H45.0416C45.5709 35.5185 46 35.9476 46 36.4769C46 37.0062 45.5709 37.4352 45.0416 37.4352ZM39.0422 41.7178H6.96154C6.43227 41.7178 6.00318 41.2887 6.00318 40.7595C6.00318 40.2302 6.43227 39.8011 6.96154 39.8011H39.0423C39.5716 39.8011 40.0007 40.2302 40.0007 40.7595C40.0006 41.2886 39.5715 41.7178 39.0422 41.7178ZM31.4958 46.0006H14.506C13.9767 46.0006 13.5476 45.5715 13.5476 45.0422C13.5476 44.513 13.9767 44.0839 14.506 44.0839H31.4958C32.0251 44.0839 32.4542 44.513 32.4542 45.0422C32.4542 45.5715 32.0251 46.0006 31.4958 46.0006ZM12.9192 16.3582C12.6557 15.903 12.809 15.3136 13.2689 15.05C13.7289 14.7865 14.3135 14.9447 14.5771 15.3998L15.7366 17.4027C16.0001 17.8627 15.842 18.4473 15.3868 18.7156C14.942 18.9658 14.3512 18.8354 14.0739 18.361L12.9192 16.3582ZM7.86879 31.8689C7.86879 32.396 7.43754 32.8273 6.91042 32.8273H4.51465C3.98277 32.8273 3.55629 32.3961 3.55629 31.8689C3.55585 31.7429 3.58033 31.6181 3.62834 31.5016C3.67635 31.3851 3.74692 31.2793 3.836 31.1902C3.92508 31.1012 4.03091 31.0306 4.14738 30.9826C4.26385 30.9346 4.38867 30.9101 4.51465 30.9105H6.91042C7.43745 30.9105 7.86879 31.3369 7.86879 31.8689ZM8.54441 24.6431L6.50801 23.469C6.05286 23.2055 5.89465 22.6209 6.15825 22.1609C6.42176 21.7058 7.00637 21.5475 7.46637 21.8111L9.50286 22.9851C9.96286 23.2486 10.1162 23.8333 9.85262 24.2933C9.59801 24.7335 9.03154 24.917 8.54441 24.6431ZM19.594 4.3599C19.2204 3.98615 19.2204 3.37764 19.594 3.00389L22.3157 0.28216H22.3204C22.5276 0.0404805 22.7978 0.01775 23.0009 -0.000488281C23.4643 -0.000488281 23.6908 0.31657 23.7389 0.349273L26.4031 3.00389C26.4919 3.09255 26.5624 3.19786 26.6105 3.31379C26.6586 3.42972 26.6834 3.554 26.6834 3.67951C26.6834 3.80502 26.6586 3.9293 26.6105 4.04524C26.5624 4.16117 26.4919 4.26648 26.4031 4.35514C26.3151 4.44482 26.2101 4.51614 26.0943 4.56497C25.9785 4.61381 25.8541 4.63918 25.7285 4.63962C25.6028 4.64007 25.4783 4.61557 25.3621 4.56755C25.246 4.51954 25.1405 4.44896 25.0519 4.3599L23.9592 3.27216V9.03177C23.9592 9.56365 23.528 9.99014 23.0008 9.99014C22.8748 9.99058 22.75 9.96609 22.6335 9.91808C22.5171 9.87007 22.4112 9.7995 22.3222 9.71042C22.2331 9.62134 22.1625 9.51551 22.1145 9.39904C22.0665 9.28257 22.042 9.15775 22.0424 9.03177V3.2674L20.9499 4.3599C20.7631 4.54677 20.5187 4.63778 20.2743 4.63778C20.03 4.63788 19.7809 4.54686 19.594 4.3599ZM23.9352 13.4065V15.7065C23.9352 16.2336 23.504 16.6649 22.9768 16.6649C22.4449 16.6649 22.0185 16.2336 22.0185 15.7065V13.4065C22.018 13.2806 22.0425 13.1557 22.0905 13.0393C22.1385 12.9228 22.2091 12.817 22.2982 12.7279C22.3873 12.6388 22.4931 12.5682 22.6096 12.5202C22.726 12.4722 22.8508 12.4477 22.9768 12.4482C23.504 12.4483 23.9352 12.8748 23.9352 13.4065ZM30.2218 17.4124L31.276 15.5868C31.5395 15.1268 32.1241 14.9686 32.5841 15.2323C33.0441 15.4959 33.2023 16.0851 32.9387 16.5404L31.8846 18.3709C31.6277 18.8152 31.0455 18.9931 30.5764 18.7206C30.4672 18.6581 30.3713 18.5746 30.2943 18.475C30.2173 18.3754 30.1607 18.2616 30.1278 18.1401C30.0949 18.0185 30.0862 17.8917 30.1023 17.7669C30.1185 17.642 30.1591 17.5215 30.2218 17.4124ZM36.8104 31.773C36.8104 32.3912 36.7721 32.9997 36.6907 33.6034H9.27268C9.19129 32.9997 9.15292 32.3912 9.15292 31.773C9.15292 24.1447 15.3533 17.9443 22.9817 17.9443C30.6053 17.9443 36.8104 24.1447 36.8104 31.773ZM39.2637 23.5745L37.4046 24.643C36.9422 24.9114 36.3584 24.7463 36.0964 24.2933C35.8329 23.8334 35.991 23.2486 36.451 22.9851L38.3101 21.9118C38.7652 21.6483 39.3547 21.8064 39.6182 22.2663C39.681 22.3754 39.7217 22.4959 39.7378 22.6207C39.754 22.7456 39.7454 22.8724 39.7124 22.994C39.6795 23.1155 39.6229 23.2293 39.5459 23.329C39.4689 23.4286 39.373 23.512 39.2637 23.5745ZM42.1867 31.8689C42.1867 32.396 41.7603 32.8273 41.2283 32.8273H39.0433C38.5114 32.8273 38.0849 32.3961 38.0849 31.8689C38.0845 31.7429 38.109 31.6181 38.157 31.5016C38.205 31.3851 38.2756 31.2793 38.3647 31.1902C38.4537 31.1012 38.5596 31.0306 38.676 30.9826C38.7925 30.9346 38.9173 30.9101 39.0433 30.9105H41.2283C41.3543 30.9101 41.4791 30.9346 41.5956 30.9826C41.7121 31.0306 41.8179 31.1012 41.907 31.1902C41.996 31.2793 42.0666 31.3851 42.1146 31.5016C42.1626 31.6181 42.1871 31.7429 42.1867 31.8689Z" fill={nextPrayer?.name === 'fajr' ? "#FBB04C" : "#9E9996"} />
                    </svg>}

                    {key == 'sunrise' && <svg width="46" height="34" viewBox="0 0 46 34" fill={nextPrayer?.name === 'sunrise' ? "#FBB04C" : "#9E9996"} xmlns="http://www.w3.org/2000/svg">
                      <path fill={nextPrayer?.name === 'sunrise' ? "#FBB04C" : "#9E9996"} d="M45.0416 25.4353H0.958363C0.429094 25.4353 0 25.0062 0 24.477C0 23.9477 0.429094 23.5186 0.958363 23.5186H45.0416C45.5709 23.5186 46 23.9477 46 24.477C46 25.0062 45.5709 25.4353 45.0416 25.4353ZM39.0422 29.7179H6.96154C6.43227 29.7179 6.00318 29.2888 6.00318 28.7595C6.00318 28.2303 6.43227 27.8012 6.96154 27.8012H39.0423C39.5716 27.8012 40.0007 28.2303 40.0007 28.7595C40.0006 29.2887 39.5715 29.7179 39.0422 29.7179ZM31.4958 34.0007H14.506C13.9767 34.0007 13.5476 33.5716 13.5476 33.0423C13.5476 32.513 13.9767 32.0839 14.506 32.0839H31.4958C32.0251 32.0839 32.4542 32.513 32.4542 33.0423C32.4542 33.5716 32.0251 34.0007 31.4958 34.0007ZM12.9192 4.35825C12.6557 3.9031 12.809 3.31364 13.2689 3.05012C13.7289 2.78661 14.3135 2.94474 14.5771 3.39989L15.7366 5.40277C16.0001 5.86277 15.842 6.44739 15.3868 6.71566C14.942 6.96587 14.3512 6.83551 14.0739 6.36105L12.9192 4.35825ZM7.86879 19.869C7.86879 20.3961 7.43754 20.8273 6.91042 20.8273H4.51465C3.98277 20.8273 3.55629 20.3962 3.55629 19.869C3.55585 19.743 3.58033 19.6182 3.62834 19.5017C3.67635 19.3852 3.74692 19.2794 3.836 19.1903C3.92508 19.1012 4.03091 19.0307 4.14738 18.9827C4.26385 18.9347 4.38867 18.9102 4.51465 18.9106H6.91042C7.43745 18.9106 7.86879 19.337 7.86879 19.869ZM8.54441 12.6432L6.50801 11.4691C6.05286 11.2056 5.89465 10.621 6.15825 10.161C6.42176 9.70584 7.00637 9.54762 7.46637 9.81122L9.50286 10.9852C9.96286 11.2487 10.1162 11.8333 9.85262 12.2933C9.59801 12.7336 9.03154 12.9171 8.54441 12.6432ZM23.9352 1.40661V3.70661C23.9352 4.23373 23.504 4.66498 22.9768 4.66498C22.4449 4.66498 22.0185 4.23373 22.0185 3.70661V1.40661C22.018 1.28064 22.0425 1.15582 22.0905 1.03934C22.1385 0.922872 22.2091 0.817048 22.2982 0.727968C22.3873 0.638888 22.4931 0.568312 22.6096 0.520306C22.726 0.472299 22.8508 0.447809 22.9768 0.448248C23.504 0.448338 23.9352 0.874827 23.9352 1.40661ZM30.2218 5.41248L31.276 3.58685C31.5395 3.12685 32.1241 2.96873 32.5841 3.23233C33.0441 3.49593 33.2023 4.08521 32.9387 4.54045L31.8846 6.37093C31.6277 6.8153 31.0455 6.99319 30.5764 6.72069C30.4672 6.65817 30.3713 6.57471 30.2943 6.47509C30.2173 6.37547 30.1607 6.26164 30.1278 6.14013C30.0949 6.01862 30.0862 5.8918 30.1023 5.76694C30.1185 5.64208 30.1591 5.52163 30.2218 5.41248ZM36.8104 19.7731C36.8104 20.3912 36.7721 20.9997 36.6907 21.6035H9.27268C9.19129 20.9997 9.15292 20.3912 9.15292 19.7731C9.15292 12.1447 15.3533 5.94435 22.9817 5.94435C30.6053 5.94435 36.8104 12.1447 36.8104 19.7731ZM39.2637 11.5746L37.4046 12.6431C36.9422 12.9115 36.3584 12.7464 36.0964 12.2933C35.8329 11.8334 35.991 11.2487 36.451 10.9852L38.3101 9.91185C38.7652 9.64834 39.3547 9.80646 39.6182 10.2664C39.681 10.3755 39.7217 10.496 39.7378 10.6208C39.754 10.7457 39.7454 10.8725 39.7124 10.994C39.6795 11.1156 39.6229 11.2294 39.5459 11.329C39.4689 11.4286 39.373 11.5121 39.2637 11.5746ZM42.1867 19.869C42.1867 20.3961 41.7603 20.8273 41.2283 20.8273H39.0433C38.5114 20.8273 38.0849 20.3962 38.0849 19.869C38.0845 19.743 38.109 19.6182 38.157 19.5017C38.205 19.3852 38.2756 19.2794 38.3647 19.1903C38.4537 19.1012 38.5596 19.0307 38.676 18.9827C38.7925 18.9347 38.9173 18.9102 39.0433 18.9106H41.2283C41.3543 18.9102 41.4791 18.9347 41.5956 18.9827C41.7121 19.0307 41.8179 19.1012 41.907 19.1903C41.996 19.2794 42.0666 19.3852 42.1146 19.5017C42.1626 19.6182 42.1871 19.743 42.1867 19.869Z" />
                    </svg>}

                    {key == 'dhuhr' && <svg width="46" height="46" viewBox="0 0 46 46" fill={nextPrayer?.name === 'dhuhr' ? "#FBB04C" : "#9E9996"} xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.1534 14.8466C29.0847 12.7778 26.164 11.4392 23 11.4392C19.836 11.4392 16.9153 12.7169 14.8466 14.8466C12.7778 16.9153 11.4392 19.836 11.4392 23C11.4392 26.164 12.7778 29.0847 14.8466 31.1534C16.9153 33.2222 19.836 34.5608 23 34.5608C26.164 34.5608 29.0847 33.2831 31.1534 31.1534C33.2222 29.0847 34.5608 26.164 34.5608 23C34.5608 19.836 33.2831 16.9153 31.1534 14.8466ZM23 7.84921C23.8518 7.84921 24.582 7.11905 24.582 6.2672V1.58201C24.582 0.730159 23.8518 0 23 0C22.1481 0 21.418 0.730159 21.418 1.58201V6.2672C21.418 7.11905 22.1481 7.84921 23 7.84921ZM35.9603 12.291L39.3069 8.94444C39.9153 8.33598 39.9153 7.36243 39.3069 6.75397C38.6984 6.1455 37.7249 6.1455 37.1164 6.75397L33.7698 10.1005C33.1614 10.709 33.1614 11.6825 33.7698 12.291C34.3175 12.8995 35.291 12.8995 35.9603 12.291ZM44.418 21.418H39.7328C38.881 21.418 38.1508 22.1481 38.1508 23C38.1508 23.8518 38.881 24.582 39.7328 24.582H44.418C45.2698 24.582 46 23.8518 46 23C46 22.1481 45.2698 21.418 44.418 21.418ZM35.8995 33.709C35.291 33.1005 34.3175 33.1005 33.709 33.709C33.1005 34.3175 33.1005 35.291 33.709 35.8995L37.0556 39.246C37.664 39.8545 38.6376 39.8545 39.246 39.246C39.8545 38.6376 39.8545 37.664 39.246 37.0556L35.8995 33.709ZM23 38.1508C22.1481 38.1508 21.418 38.881 21.418 39.7328V44.418C21.418 45.2698 22.1481 46 23 46C23.8518 46 24.582 45.2698 24.582 44.418V39.7328C24.582 38.881 23.8518 38.1508 23 38.1508ZM10.0397 33.709L6.69312 37.0556C6.08466 37.664 6.08466 38.6376 6.69312 39.246C7.30159 39.8545 8.27513 39.8545 8.8836 39.246L12.2302 35.8995C12.8386 35.291 12.8386 34.3175 12.2302 33.709C11.6825 33.1005 10.709 33.1005 10.0397 33.709ZM7.84921 23C7.84921 22.1481 7.11905 21.418 6.2672 21.418H1.58201C0.730159 21.418 0 22.1481 0 23C0 23.8518 0.730159 24.582 1.58201 24.582H6.2672C7.11905 24.582 7.84921 23.8518 7.84921 23ZM10.0397 12.291C10.6481 12.8995 11.6217 12.8995 12.2302 12.291C12.8386 11.6825 12.8386 10.709 12.2302 10.1005L8.8836 6.75397C8.27513 6.1455 7.30159 6.1455 6.69312 6.75397C6.08466 7.36243 6.08466 8.33598 6.69312 8.94444L10.0397 12.291Z" fill={nextPrayer?.name === 'dhuhr' ? "#FBB04C" : "#9E9996"} />
                    </svg>}


                    {key == 'asr' && <svg width="42" height="42" viewBox="0 0 42 42" fill={nextPrayer?.name === 'asr' ? "#FBB04C" : "#9E9996"} xmlns="http://www.w3.org/2000/svg">
                      <path d="M35.5651 29.3925C34.8478 29.3919 34.1364 29.5209 33.4651 29.7735C33.3493 29.8169 33.225 29.8325 33.1021 29.819C32.9792 29.8054 32.8613 29.7631 32.7578 29.6955C32.6543 29.6257 32.5691 29.532 32.5095 29.4224C32.4498 29.3127 32.4174 29.1903 32.4151 29.0655C32.3968 28.196 32.1979 27.3397 31.8311 26.5511C31.4643 25.7625 30.9376 25.0587 30.2843 24.4845C26.3768 20.9903 19.9351 23.9438 20.0093 29.2755C20.036 29.4211 20.022 29.5713 19.9689 29.7094C19.9157 29.8476 19.8255 29.9683 19.708 30.0585C19.5906 30.1486 19.4506 30.2046 19.3034 30.2202C19.1562 30.2358 19.0075 30.2105 18.8738 30.147C17.9672 29.6528 16.9513 29.3935 15.9188 29.3925C14.2638 29.4181 12.6852 30.0934 11.5238 31.2728C10.3625 32.4522 9.71155 34.0411 9.71155 35.6963C9.71155 37.3515 10.3625 38.9403 11.5238 40.1197C12.6852 41.2991 14.2638 41.9745 15.9188 42H35.5651C43.7866 41.688 43.7851 29.7098 35.5651 29.3925Z" fill={nextPrayer?.name === 'asr' ? "#FBB04C" : "#9E9996"} />
                      <path d="M11.322 29.361C12.3396 28.6055 13.5276 28.1124 14.7811 27.9254C16.0345 27.7383 17.3148 27.863 18.5085 28.2885C18.6572 26.9988 19.1269 25.767 19.8746 24.7057C20.6223 23.6444 21.6241 22.7874 22.7885 22.2133C23.9529 21.6391 25.2426 21.366 26.5398 21.419C27.8369 21.472 29.1001 21.8493 30.2138 22.5165C30.6972 22.8073 31.1461 23.152 31.5518 23.544C31.8803 22.4144 32.0452 21.2434 32.0415 20.067C32.0348 16.7688 30.72 13.608 28.3858 11.2779C26.0515 8.9478 22.8882 7.63879 19.59 7.638C8.21254 7.63275 2.84629 21.8475 11.322 29.361ZM19.596 4.73625C19.8023 4.73625 20.0001 4.65431 20.146 4.50845C20.2918 4.3626 20.3738 4.16477 20.3738 3.9585V0.77775C20.3738 0.571478 20.2918 0.373654 20.146 0.227798C20.0001 0.0819415 19.8023 0 19.596 0C19.3898 0 19.1919 0.0819415 19.0461 0.227798C18.9002 0.373654 18.8183 0.571478 18.8183 0.77775V3.95775C18.8182 4.05995 18.8382 4.16116 18.8773 4.25561C18.9163 4.35006 18.9736 4.43589 19.0458 4.50819C19.1181 4.58049 19.2038 4.63784 19.2982 4.67698C19.3926 4.71611 19.4938 4.73625 19.596 4.73625ZM11.238 6.4065C11.3412 6.58522 11.5111 6.71566 11.7104 6.7691C11.9097 6.82255 12.1221 6.79464 12.3008 6.6915C12.4795 6.58836 12.6099 6.41846 12.6634 6.21915C12.7168 6.01985 12.6889 5.80747 12.5858 5.62875L10.9958 2.874C10.9447 2.78551 10.8767 2.70794 10.7957 2.64572C10.7146 2.58351 10.6221 2.53786 10.5234 2.5114C10.4248 2.48493 10.3218 2.47816 10.2205 2.49148C10.1192 2.50479 10.0215 2.53793 9.93304 2.589C9.84454 2.64007 9.76697 2.70807 9.70476 2.78911C9.64254 2.87016 9.5969 2.96266 9.57043 3.06135C9.54397 3.16004 9.5372 3.26297 9.55052 3.36427C9.56383 3.46557 9.59697 3.56326 9.64804 3.65175L11.238 6.4065ZM6.67504 10.9695L3.92104 9.3795C3.74257 9.27898 3.53164 9.25292 3.33408 9.30698C3.13651 9.36105 2.96824 9.49087 2.86582 9.66826C2.7634 9.84564 2.73509 10.0563 2.78704 10.2544C2.83899 10.4525 2.967 10.6222 3.14329 10.7265C3.37579 10.815 6.08104 12.5415 6.28579 12.4215C6.45549 12.4185 6.6196 12.3603 6.75336 12.2558C6.88712 12.1514 6.98327 12.0062 7.0273 11.8423C7.07133 11.6784 7.06085 11.5046 6.99744 11.3471C6.93403 11.1897 6.82113 11.0571 6.67579 10.9695H6.67504ZM5.00554 19.3275C5.00554 19.1212 4.9236 18.9234 4.77774 18.7775C4.63188 18.6317 4.43406 18.5497 4.22779 18.5497H1.04704C0.840765 18.5497 0.642941 18.6317 0.497085 18.7775C0.351228 18.9234 0.269287 19.1212 0.269287 19.3275C0.269287 19.5338 0.351228 19.7316 0.497085 19.8775C0.642941 20.0233 0.840765 20.1052 1.04704 20.1052H4.22704C4.32924 20.1053 4.43045 20.0853 4.5249 20.0463C4.61935 20.0072 4.70517 19.9499 4.77747 19.8777C4.84977 19.8055 4.90713 19.7197 4.94626 19.6253C4.9854 19.5309 5.00554 19.4297 5.00554 19.3275ZM5.89804 26.3377L3.14254 27.9285C2.96381 28.0316 2.83338 28.2015 2.77993 28.4008C2.72649 28.6002 2.7544 28.8125 2.85754 28.9912C2.96067 29.17 3.13058 29.3004 3.32989 29.3539C3.52919 29.4073 3.74156 29.3794 3.92029 29.2762L6.67504 27.6863C6.85386 27.5831 6.98439 27.4132 7.0379 27.2138C7.09142 27.0144 7.06355 26.8019 6.96041 26.6231C6.85728 26.4443 6.68733 26.3138 6.48795 26.2603C6.28858 26.2067 6.07611 26.2346 5.89729 26.3377H5.89804ZM34.1873 19.3275C34.1873 19.5338 34.2692 19.7316 34.4151 19.8775C34.5609 20.0233 34.7588 20.1052 34.965 20.1052H38.1458C38.3521 20.1052 38.5499 20.0233 38.6957 19.8775C38.8416 19.7316 38.9235 19.5338 38.9235 19.3275C38.9235 19.1212 38.8416 18.9234 38.6957 18.7775C38.5499 18.6317 38.3521 18.5497 38.1458 18.5497H34.9658C34.8636 18.5497 34.7624 18.5697 34.6679 18.6087C34.5735 18.6478 34.4877 18.7051 34.4154 18.7773C34.343 18.8495 34.2857 18.9353 34.2466 19.0297C34.2074 19.1241 34.1873 19.2253 34.1873 19.3275ZM32.907 12.4208C33.0432 12.4207 33.1769 12.3847 33.2948 12.3165L36.0495 10.7265C36.2283 10.6234 36.3587 10.4535 36.4121 10.2542C36.4656 10.0548 36.4377 9.84247 36.3345 9.66375C36.2314 9.48503 36.0615 9.3546 35.8622 9.30115C35.6629 9.2477 35.4505 9.27561 35.2718 9.37875L32.517 10.9688C32.3717 11.0564 32.2588 11.1889 32.1954 11.3464C32.132 11.5038 32.1215 11.6776 32.1655 11.8415C32.2095 12.0055 32.3057 12.1506 32.4395 12.2551C32.5732 12.3596 32.7373 12.4177 32.907 12.4208ZM26.892 6.6915C27.0708 6.79431 27.2831 6.82204 27.4823 6.76862C27.6815 6.71519 27.8514 6.58498 27.9548 6.4065L29.5448 3.65175C29.5959 3.56326 29.629 3.46557 29.6423 3.36427C29.6556 3.26297 29.6489 3.16004 29.6224 3.06135C29.5959 2.96266 29.5503 2.87016 29.4881 2.78911C29.4258 2.70807 29.3483 2.64007 29.2598 2.589C29.1713 2.53793 29.0736 2.50479 28.9723 2.49148C28.871 2.47816 28.7681 2.48493 28.6694 2.5114C28.5707 2.53786 28.4782 2.58351 28.3971 2.64572C28.3161 2.70794 28.2481 2.78551 28.197 2.874L26.607 5.62875C26.504 5.8075 26.4762 6.01983 26.5296 6.2191C26.5831 6.41837 26.7134 6.58828 26.892 6.6915Z" fill={nextPrayer?.name === 'asr' ? "#FBB04C" : "#9E9996"} />
                    </svg>}

                    {key == 'maghrib' && <svg width="46" height="45" viewBox="0 0 46 45" fill={nextPrayer?.name === 'maghrib' ? "#FBB04C" : "#9E9996"} xmlns="http://www.w3.org/2000/svg">
                      <path d="M45.0416 36.4352H0.958363C0.429094 36.4352 0 36.0061 0 35.4768C0 34.9476 0.429094 34.5185 0.958363 34.5185H45.0416C45.5709 34.5185 46 34.9476 46 35.4768C46 36.0061 45.5709 36.4352 45.0416 36.4352ZM39.0422 40.7178H6.96154C6.43227 40.7178 6.00318 40.2887 6.00318 39.7594C6.00318 39.2302 6.43227 38.8011 6.96154 38.8011H39.0423C39.5716 38.8011 40.0007 39.2302 40.0007 39.7594C40.0006 40.2886 39.5715 40.7178 39.0422 40.7178ZM31.4958 45.0005H14.506C13.9767 45.0005 13.5476 44.5714 13.5476 44.0422C13.5476 43.5129 13.9767 43.0838 14.506 43.0838H31.4958C32.0251 43.0838 32.4542 43.5129 32.4542 44.0422C32.4542 44.5714 32.0251 45.0005 31.4958 45.0005ZM12.9192 15.3581C12.6557 14.903 12.809 14.3135 13.2689 14.05C13.7289 13.7865 14.3135 13.9446 14.5771 14.3998L15.7366 16.4026C16.0001 16.8626 15.842 17.4473 15.3868 17.7155C14.942 17.9658 14.3512 17.8354 14.0739 17.3609L12.9192 15.3581ZM7.86879 30.8688C7.86879 31.396 7.43754 31.8272 6.91042 31.8272H4.51465C3.98277 31.8272 3.55629 31.396 3.55629 30.8688C3.55585 30.7429 3.58033 30.618 3.62834 30.5016C3.67635 30.3851 3.74692 30.2793 3.836 30.1902C3.92508 30.1011 4.03091 30.0305 4.14738 29.9825C4.26385 29.9345 4.38867 29.91 4.51465 29.9105H6.91042C7.43745 29.9105 7.86879 30.3369 7.86879 30.8688ZM8.54441 23.6431L6.50801 22.469C6.05286 22.2055 5.89465 21.6209 6.15825 21.1609C6.42176 20.7057 7.00637 20.5475 7.46637 20.8111L9.50286 21.9851C9.96286 22.2486 10.1162 22.8332 9.85262 23.2932C9.59801 23.7335 9.03154 23.917 8.54441 23.6431ZM23.9352 12.4065V14.7065C23.9352 15.2336 23.504 15.6649 22.9768 15.6649C22.4449 15.6649 22.0185 15.2336 22.0185 14.7065V12.4065C22.018 12.2805 22.0425 12.1557 22.0905 12.0392C22.1385 11.9227 22.2091 11.8169 22.2982 11.7278C22.3873 11.6388 22.4931 11.5682 22.6096 11.5202C22.726 11.4722 22.8508 11.4477 22.9768 11.4481C23.504 11.4482 23.9352 11.8747 23.9352 12.4065ZM30.2218 16.4124L31.276 14.5867C31.5395 14.1267 32.1241 13.9686 32.5841 14.2322C33.0441 14.4958 33.2023 15.0851 32.9387 15.5403L31.8846 17.3708C31.6277 17.8152 31.0455 17.9931 30.5764 17.7206C30.4672 17.658 30.3713 17.5746 30.2943 17.475C30.2173 17.3753 30.1607 17.2615 30.1278 17.14C30.0949 17.0185 30.0862 16.8917 30.1023 16.7668C30.1185 16.642 30.1591 16.5215 30.2218 16.4124ZM36.8104 30.773C36.8104 31.3911 36.7721 31.9996 36.6907 32.6034H9.27268C9.19129 31.9996 9.15292 31.3911 9.15292 30.773C9.15292 23.1446 15.3533 16.9442 22.9817 16.9442C30.6053 16.9442 36.8104 23.1446 36.8104 30.773ZM39.2637 22.5745L37.4046 23.643C36.9422 23.9113 36.3584 23.7463 36.0964 23.2932C35.8329 22.8333 35.991 22.2486 36.451 21.9851L38.3101 20.9117C38.7652 20.6482 39.3547 20.8063 39.6182 21.2663C39.681 21.3754 39.7217 21.4958 39.7378 21.6207C39.754 21.7456 39.7454 21.8724 39.7124 21.9939C39.6795 22.1155 39.6229 22.2293 39.5459 22.3289C39.4689 22.4285 39.373 22.512 39.2637 22.5745ZM42.1867 30.8688C42.1867 31.396 41.7603 31.8272 41.2283 31.8272H39.0433C38.5114 31.8272 38.0849 31.396 38.0849 30.8688C38.0845 30.7429 38.109 30.618 38.157 30.5016C38.205 30.3851 38.2756 30.2793 38.3647 30.1902C38.4537 30.1011 38.5596 30.0305 38.676 29.9825C38.7925 29.9345 38.9173 29.91 39.0433 29.9105H41.2283C41.3543 29.91 41.4791 29.9345 41.5956 29.9825C41.7121 30.0305 41.8179 30.1011 41.907 30.1902C41.996 30.2793 42.0666 30.3851 42.1146 30.5016C42.1626 30.618 42.1871 30.7429 42.1867 30.8688Z" fill={nextPrayer?.name === 'maghrib' ? "#FBB04C" : "#9E9996"} />
                      <path d="M26.4029 6.98623C26.7765 6.61248 26.7765 6.00396 26.4029 5.63021C26.216 5.44325 25.9668 5.35224 25.7226 5.35233C25.4782 5.35233 25.2338 5.44334 25.0469 5.63021L23.9544 6.72271L23.9544 0.958338C23.9549 0.832361 23.9304 0.707542 23.8824 0.59107C23.8344 0.474598 23.7638 0.368774 23.6747 0.279694C23.5856 0.190614 23.4798 0.120039 23.3633 0.0720317C23.2469 0.0240247 23.1221 -0.000463797 22.9961 -2.41642e-05C22.4689 -2.42103e-05 22.0377 0.426464 22.0377 0.958338L22.0377 6.71795L20.945 5.63021C20.8564 5.54115 20.7509 5.47057 20.6348 5.42256C20.5186 5.37454 20.3941 5.35005 20.2684 5.35049C20.1427 5.35093 20.0184 5.3763 19.9026 5.42514C19.7868 5.47397 19.6818 5.54529 19.5938 5.63497C19.5049 5.72363 19.4345 5.82894 19.3864 5.94488C19.3383 6.06081 19.3135 6.18509 19.3135 6.3106C19.3135 6.43611 19.3383 6.56039 19.3864 6.67632C19.4345 6.79226 19.5049 6.89757 19.5938 6.98622L22.258 9.64084C22.3061 9.67354 22.5326 9.9906 22.996 9.9906L23.0001 9.99023C23.2028 9.97205 23.4707 9.948 23.6765 9.70795L23.6812 9.70795L26.4029 6.98623Z" fill={nextPrayer?.name === 'maghrib' ? "#FBB04C" : "#9E9996"} />
                    </svg>}

                    {key == 'isha' && <svg width="46" height="46" viewBox="0 0 46 46" fill={nextPrayer?.name === 'isha' ? "#FBB04C" : "#9E9996"} xmlns="http://www.w3.org/2000/svg">
                      <path d="M45.349 27.5216C44.8257 27.1987 44.1501 27.258 43.697 27.6721C40.3974 30.665 36.1291 32.3142 31.6808 32.3142C21.8075 32.3142 13.7745 24.2813 13.7745 14.4079C13.7745 9.95926 15.4237 5.69124 18.4165 2.39164C18.6176 2.16999 18.7411 1.88889 18.7682 1.59085C18.7954 1.29281 18.7248 0.994032 18.5671 0.739679C18.2428 0.217866 17.6079 -0.0243527 17.0215 0.141319C6.99865 2.97948 0 12.2447 0 22.6722C0 35.5843 10.5044 46.0883 23.4162 46.0883C33.8437 46.0883 43.1092 39.0897 45.9474 29.0671C46.0291 28.7795 46.015 28.473 45.907 28.1941C45.7991 27.9153 45.6032 27.6791 45.349 27.5216Z" fill={nextPrayer?.name === 'isha' ? "#FBB04C" : "#9E9996"} />
                      <path d="M22.8098 18.2669L26.0729 19.8971L27.7032 23.1606C27.8175 23.3895 27.9934 23.582 28.211 23.7164C28.4287 23.8509 28.6795 23.922 28.9354 23.9219C29.4575 23.9219 29.9334 23.6274 30.1675 23.1606L31.7994 19.8971L35.0612 18.2669C35.2899 18.1524 35.4822 17.9765 35.6167 17.7589C35.7511 17.5412 35.8223 17.2905 35.8223 17.0347C35.8223 16.7789 35.7511 16.5282 35.6167 16.3106C35.4822 16.0929 35.2899 15.917 35.0612 15.8025L31.7994 14.172L30.1675 10.9089C29.6994 9.97542 28.1688 9.97542 27.7031 10.9089L26.0729 14.172L22.8098 15.8026C22.5809 15.9169 22.3884 16.0928 22.2539 16.3104C22.1194 16.528 22.0481 16.7789 22.0482 17.0347C22.0481 17.2906 22.1193 17.5414 22.2539 17.7591C22.3884 17.9767 22.5809 18.1526 22.8098 18.2669ZM37.1904 7.52044H38.5679V8.89793C38.5679 9.65917 39.1842 10.2754 39.9454 10.2754C40.7065 10.2754 41.3228 9.65908 41.3228 8.89793V7.52044H42.7003C43.4616 7.52044 44.0778 6.90456 44.0778 6.14296C44.0778 5.38171 43.4616 4.76583 42.7003 4.76583H41.3228V3.38835C41.3228 2.62674 40.7066 2.01086 39.9454 2.01086C39.1841 2.01086 38.5679 2.62674 38.5679 3.38835V4.76583H37.1904C36.4292 4.76583 35.8133 5.38171 35.8133 6.14296C35.8133 6.90456 36.4292 7.52044 37.1904 7.52044Z" fill={nextPrayer?.name === 'isha' ? "#FBB04C" : "#9E9996"} />
                    </svg>}
                  </div>
                  <h3 className='text-xl/[20px] max-sm:text-sm/[14px]'> {t(key)}
                    <span className='sm:hidden'>:</span>
                  </h3>
                  <div className="text-brand relative text-[32px]/[32px] max-sm:text-base/[16px] font-bold">
                    {time}
                  </div>
                  {nextPrayer?.name === key && < span className='text-[#9E9996] text-base absolute bottom-[0px] left-1/2 -translate-x-1/2'>
                    ({timeRemaining})
                  </ span>}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </section >
  );
}



