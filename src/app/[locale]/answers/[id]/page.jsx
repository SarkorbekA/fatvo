'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import useAuthStore from '@/stores/auth-store';
import { useSearchParams } from 'next/navigation';
import { usePathname } from '@/i18n/routing';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import PocketBase from 'pocketbase';
import Loader from '@/components/Loader/Loader';
const pb = new PocketBase("https://back.fatvo.saidoff.uz");
import { useTranslations } from 'next-intl';
import MostRead from '@/components/MostRead/MostRead';
import NotFoundPage from '@/components/NotFoundPage';

function AnswerPage({ params }) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(true);
  const [answer, setAnswer] = useState();
  const param = React.use(params);
  const [categories, setCategories] = useState([]);
  const [iscategoryLoading, setIsCategoryLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const { isLoggedIn, setIsLoginOpen } = useAuthStore();

  const handleSave = async () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }

    const data = {
      "user": pb.authStore.record.id,
      "qa": param.id
    };

    setIsSaveLoading(true)

    try {
      await pb.collection('user_favourite_qas').create(data)

      await getAnswer(false)
    } catch (error) {
      console.log('Ошибка при сохранении:', error);
    } finally {
      setIsSaveLoading(false)
    }
  }

  const handleUnSave = async () => {

    setIsSaveLoading(true)

    try {
      await pb.collection('user_favourite_qas').delete(answer.savedId);

      setAnswer(prev => ({
        ...prev,
        isSaved: false
      }));
    } catch (error) {
      console.log('Ошибка при сохранении:', error);
    } finally {
      setIsSaveLoading(false)
    }
  }

  const getAnswer = async (bol) => {

    bol ? setIsLoading(true) : null

    try {
      let filters = [];

      const requiredFieldsFilter = `(titleLat!="" && questionCyr!="" && answerCyr!="")`;

      filters.push(requiredFieldsFilter);

      const filterString = filters.length ? filters.join(' && ') : '';

      const record = await pb.collection('question_answers').getOne(param.id, {
        expand: "*",
        filter: filterString
      });

      if (!record) {
        setIsLoading(false);
        setError(true);
        return;
      }

      if (record.user != pb?.authStore?.record?.id && record.scope == "private") {
        setIsLoading(false);
        setError(true);
        return;
      }

      setAnswer(record);

    } catch (error) {
      console.log(error);

      setError(true)
    } finally {
      setIsLoading(false);
    }
  }

  const getCategories = async () => {
    setIsCategoryLoading(true);
    try {
      const records = await pb.collection('question_categories').getFullList({
        sort: '-created',
        fields: 'name,id'
      });

      setCategories(records);
    } catch (error) {
      console.log('Ошибка при получении категорий:', error);
    } finally {
      setIsCategoryLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    getAnswer(true);
    getCategories()
  }, []);

  if (isLoading) {
    return (
      <div>
        < Loader />
      </div>
    )
  }

  if (error) {
    return (
      <NotFoundPage />
    )
  }

  return (
    <section className='mt-2 mb-[75px]'>
      <div className='container'>
        <Breadcrumb className="w-full">
          <BreadcrumbList className="h-9 flex-nowrap w-full">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('main')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/questions">{t("questions-and-answers")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="w-[calc(100%-240px)] max-sm:w-[calc(100%-205px)]">
              <BreadcrumbPage>{answer.titleLat}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='flex gap-6 mt-8 justify-between max-md:gap-12 max-md:flex-col'>
          <div className='grow flex flex-col justify-between'>
            <div>
              <h3 className='font-semibold text-3xl/[36.4px] max-sm:text-xl/[24px]'>{answer.titleLat}</h3>
              <div className='flex gap-3 items-center mt-2.5'>
                <h3 className='text-brand flex items-center gap-1'>ID: <span className='text-[#9E9996]'>{answer.qid}</span></h3>
                <h3 className='text-brand flex items-center gap-1'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                  </svg>
                  <span className='text-[#9E9996]'>{formatDate(answer.created)}</span>
                </h3>
                <h3 className='text-brand flex items-center gap-1'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.3866 8.00001C10.3866 9.32001 9.31995 10.3867 7.99995 10.3867C6.67995 10.3867 5.61328 9.32001 5.61328 8.00001C5.61328 6.68001 6.67995 5.61334 7.99995 5.61334C9.31995 5.61334 10.3866 6.68001 10.3866 8.00001Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1266 14.0732 9.72665C14.6732 8.78665 14.6732 7.20665 14.0732 6.26665C12.5466 3.86665 10.3532 2.47998 7.9999 2.47998C5.64656 2.47998 3.45323 3.86665 1.92656 6.26665C1.32656 7.20665 1.32656 8.78665 1.92656 9.72665C3.45323 12.1266 5.64656 13.5133 7.9999 13.5133Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className='text-[#9E9996]'>{answer.views}</span>
                </h3>
              </div>
              <div style={{
                boxShadow: '0px 12px 32px 0px #4215040F',
              }} className='mt-6 w-full bg-[#FBB04C3D] max-sm:rounded-lg rounded-[20px] px-4 py-3'>
                <h3 className='mb-2 text-[#FBB04C] max-sm:text-lg/[22px] text-2xl/[29.9px] font-semibold'>{t("question")}:</h3>
                <p
                  className='font-medium text-base/[20.8px]'
                  dangerouslySetInnerHTML={{ __html: answer?.questionLat }}
                >
                </p>
              </div>
              <div className='mt-6 px-4'>
                <h3 className='mb-4 text-brand max-sm:mb-2.5 max-sm:text-lg/[22px] text-2xl/[29.9px] font-semibold'>{t("answer")}:</h3>
                <p
                  className='font-medium text-base/[20.8px]'
                  dangerouslySetInnerHTML={{ __html: answer?.answerLat }}
                >
                </p>
              </div>
            </div>
            <div className='flex w-full justify-between items-center mt-10 max-sm:flex-col-reverse max-sm:items-start gap-y-6 gap-4'>
              <h3 className='text-text font-medium max-sm:text-left'>{t("fatwa_center")}</h3>
              {answer.isSaved && isLoggedIn ? (
                <button disabled={isSaveLoading} onClick={() => handleUnSave()} style={{
                  boxShadow: "0px 12px 32px 0px #4215040F"
                }} className='py-1.5 px-3 bg-[#FBB04C] w-fit rounded-md flex gap-2.5 items-center text-background'>
                  {!isSaveLoading ? (<>
                    <h3>{t("saved_ques")}</h3>
                    <svg className='!min-w-6' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.0636 21.1133L18.0631 21.113L13.1875 18.4055C13.1867 18.4051 13.1859 18.4046 13.1851 18.4042C12.8362 18.2065 12.4088 18.1227 12.0091 18.1227C11.608 18.1227 11.1791 18.207 10.827 18.4034C10.8269 18.4034 10.8268 18.4034 10.8268 18.4035L5.94914 21.1122C5.94888 21.1123 5.94862 21.1125 5.94835 21.1126C5.25493 21.4942 4.73444 21.4628 4.41655 21.2756C4.09893 21.0885 3.82031 20.6497 3.82031 19.8602V5.77016C3.82031 3.9263 5.33645 2.41016 7.18031 2.41016H16.8203C18.6725 2.41016 20.181 3.92487 20.1903 5.77134V19.8602C20.1903 20.656 19.9108 21.0965 19.5941 21.2831C19.2776 21.4695 18.7579 21.5 18.0636 21.1133ZM11.9739 13.3837L15.9739 9.38371C16.4591 8.89845 16.4591 8.10186 15.9739 7.6166C15.4886 7.13134 14.692 7.13134 14.2068 7.6166L11.0903 10.733L10.4739 10.1166C9.9886 9.63134 9.19202 9.63134 8.70676 10.1166C8.2215 10.6019 8.2215 11.3984 8.70676 11.8837L10.2068 13.3837C10.4555 13.6324 10.7749 13.7502 11.0903 13.7502C11.4058 13.7502 11.7252 13.6324 11.9739 13.3837Z" fill="white" stroke="white" />
                    </svg>
                  </>) :
                    <div className='min-w-[120px]'>
                      <div className='loading !w-6 !h-6 m-auto'></div>
                    </div>
                  }
                </button>
              ) : (
                <button disabled={isSaveLoading} onClick={() => handleSave()} style={{
                  boxShadow: "0px 12px 32px 0px #4215040F"
                }} className='py-1.5 px-3 bg-background rounded-md flex gap-2.5 items-center text-[#FBB04C]'>
                  {!isSaveLoading ? (<>
                    <h3>{t("save")}</h3>
                    <svg className='!min-w-6' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.8203 2H7.18031C5.05031 2 3.32031 3.74 3.32031 5.86V19.95C3.32031 21.75 4.61031 22.51 6.19031 21.64L11.0703 18.93C11.5903 18.64 12.4303 18.64 12.9403 18.93L17.8203 21.64C19.4003 22.52 20.6903 21.76 20.6903 19.95V5.86C20.6803 3.74 18.9503 2 16.8203 2Z" stroke="#FBB04C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>) :
                    <div className='min-w-[120px]'>
                      <div className='loading !w-6 !h-6 m-auto'></div>
                    </div>
                  }
                </button>
              )}
            </div>
          </div>
          <div className='py-4 max-md:max-w-full max-w-[278px] rounded-[20px] bg-background w-full flex flex-col gap-2.5'>
            <h3 className='px-4 text-brand -tracking-[0.64px] text-2xl font-extrabold'>{t('categories')}</h3>
            <Categories categories={categories} isLoading={iscategoryLoading} />
          </div>
        </div>

        <section className='mt-20 max-md:mt-14'>
          <h3 className='text-[40px]/[52px] mb-5 [@media(max-width:576px)]:text-[22px]/[28px] -tracking-[0.64px] font-extrabold'>{t('most_read_questions')}</h3>
          <MostRead quesId={param.id} />
        </section>
      </div>
    </section>
  );
}


const Categories = ({ categories, isLoading }) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const buildLink = useCallback(
    (newCategory) => {
      const key = "category";
      if (!searchParams) return `${pathname}?${key}=${newCategory}`;

      const newSearchParams = new URLSearchParams(searchParams);

      if (newCategory) {
        newSearchParams.set(key, String(newCategory));
      } else {
        newSearchParams.delete(key);
      }

      return `/questions?${newSearchParams.toString()}`;
    },
    [searchParams, pathname]
  );

  const handleCategoryClick = (id) => {
    if (selectedCategory === id) {
      router.push(buildLink(''));
      return;
    }
    const newLink = buildLink(id);
    router.push(newLink);
  };

  const selectedCategory = searchParams.get("category");


  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px] bg-background'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }

  if (!categories.length) {
    return (
      <div className='flex items-center justify-center min-h-[200px] text-sm font-semibold text-[#9E9996] select-none'>{t('empty')}</div>
    )
  }

  return (
    <ul className='flex flex-col max-h-[600px] scrollbarY overflow-y-auto max-md:px-4 max-md:flex-row max-md:gap-2 max-md:flex-wrap'>
      {categories.map((_, index) => (
        <React.Fragment key={index}>
          <li
            className={`text-text text-base/[21px] max-md:py-1.5 max-md:border max-md:rounded-lg max-md:px-3 py-2.5 font-semibold cursor-pointer md:mx-4 hover:text-brand ${index !== categories.length - 1 ? "border-b" : ""}`}
            onClick={() => handleCategoryClick(_.id)}
          >
            {_.name}
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
}


export default AnswerPage;
