'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
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
import MostReadArticles from '@/components/MostReadArticles/MostReadArticles';

const baseUrl = "https://back.fatvo.saidoff.uz/api/files/";

const getFileUrl = (collectionId, recordId, fileName) => {
  return `${baseUrl}${collectionId}/${recordId}/${fileName}`;
};

function ArticlePage({ params }) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState();
  const param = React.use(params);
  const [categories, setCategories] = useState([]);
  const [iscategoryLoading, setIsCategoryLoading] = useState(true);

  const getArticle = async () => {
    setIsLoading(true);
    try {
      const record = await pb.collection('articles').getOne(param.id, {
        expand: 'category',
      });

      setArticle(record);

    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }


  const getCategories = async () => {
    setIsCategoryLoading(true);
    try {
      const records = await pb.collection('article_categories').getFullList({
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
    getArticle();
    getCategories()
  }, []);

  if (isLoading) {
    return (
      <div>
        < Loader />
      </div>
    )
  }

  return (
    <section className='mt-2 mb-[75px]'>
      <div className='container'>
        <Breadcrumb>
          <BreadcrumbList className="h-9">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('main')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/articles">{t("articles")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="w-[calc(100%-190px)] max-sm:w-[calc(100%-170px)]">
              <BreadcrumbPage >{article.title} </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='flex gap-6 mt-8 justify-between max-md:flex-col'>
          <div className='grow'>
            <h3 className='font-semibold text-3xl/[36.4px] max-sm:text-xl/[26px]'>{article.title}</h3>
            <div className='flex gap-3 items-center mt-2'>
              <h3 className='text-[#FBB04C] text-sm/[14px]'>{article.expand.category.name}</h3>
              <h3 className='text-brand flex items-center gap-1'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                </svg>
                <span className='text-[#9E9996] text-sm/[14px]'>{formatDate(article.created)}</span>
              </h3>
              <h3 className='text-brand flex items-center gap-1'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.3866 8.00001C10.3866 9.32001 9.31995 10.3867 7.99995 10.3867C6.67995 10.3867 5.61328 9.32001 5.61328 8.00001C5.61328 6.68001 6.67995 5.61334 7.99995 5.61334C9.31995 5.61334 10.3866 6.68001 10.3866 8.00001Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1266 14.0732 9.72665C14.6732 8.78665 14.6732 7.20665 14.0732 6.26665C12.5466 3.86665 10.3532 2.47998 7.9999 2.47998C5.64656 2.47998 3.45323 3.86665 1.92656 6.26665C1.32656 7.20665 1.32656 8.78665 1.92656 9.72665C3.45323 12.1266 5.64656 13.5133 7.9999 13.5133Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className='text-[#9E9996] text-sm/[14px]'>{article.views}</span>
              </h3>
            </div>
            <p
              className={`mt-6 max-sm:mt-8 text-text max-sm:text-xl/[26px] px-4 py-3 bg-[#19AD7C1F] rounded-xl`}
              dangerouslySetInnerHTML={{ __html: article.description }}
            />
            <div className='mt-2.5'>
              <img className='w-full' src={getFileUrl(article.collectionId, article.id, article.files[0])} alt="" />
            </div>
            <div className='mt-4'>
              <p
                className='font-medium text-base/[21px]'
                dangerouslySetInnerHTML={{ __html: article?.info }}
              >
              </p>
            </div>
          </div>
          <div className='py-4 md:min-w-[278px] md:w-[278px] h-fit rounded-[20px] bg-background w-full flex flex-col gap-2.5'>
            <h3 className='px-4 text-brand -tracking-[0.64px] text-2xl font-extrabold'>{t('articles_topics')}</h3>
            <Categories categories={categories} isLoading={iscategoryLoading} />
          </div>
        </div>

        <section className='mt-20 max-sm:mt-10'>
          <h3 className='text-3xl/[36px] max-sm:text-xl/[26px] font-semibold mb-5'>{t('most_read_articles')}</h3>
          <MostReadArticles id={param.id} />
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

      return `/articles?${newSearchParams.toString()}`;
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
    <ul className='flex flex-col max-h-[600px] scrollbarY overflow-y-auto max-lg:px-4 max-lg:flex-row max-lg:gap-2 max-lg:flex-wrap'>
      {categories.slice(0, 20).map((_, index) => (
        <React.Fragment key={index}>
          <li
            className={`text-text text-base/[21px] py-2.5 max-lg:py-1.5 max-lg:border max-lg:rounded-lg max-lg:px-3 font-semibold cursor-pointer ${selectedCategory == _.id ? "bg-[#D9D2CE] lg:pr-4 lg:pl-3 lg:border-l-4 lg:border-l-brand" : "lg:mx-4 lg:hover:text-brand"} ${index !== categories.length - 1 ? "lg:border-b" : ""}`}
            onClick={() => handleCategoryClick(_.id)}
          >
            {_.name}
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
}


export default ArticlePage;
