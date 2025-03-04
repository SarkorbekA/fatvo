'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';

import PocketBase from 'pocketbase';

import { useTranslations } from 'next-intl';


const pb = new PocketBase("https://back.fatvo.saidoff.uz");

pb.autoCancellation(false);
const baseUrl = "https://back.fatvo.saidoff.uz/api/files/";

const getFileUrl = (collectionId, recordId, fileName) => {
  return `${baseUrl}${collectionId}/${recordId}/${fileName}`;
};

const ArticlesPage = ({ searchParams }) => {
  const params = React.use(searchParams);
  const t = useTranslations('')
  const [categories, setCategories] = useState([]);
  const [iscategoryLoading, setIsCategoryLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseInt(params.page || '1');
  const postsPerPage = parseInt(params.pageSize || '10');
  const [total, setTotal] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(params.search || "");

  const submitSearch = (e) => {
    e.preventDefault();

    const key = "search";
    const newSearchParams = new URLSearchParams(params);

    if (search) {
      newSearchParams.set(key, search);
    } else {
      newSearchParams.delete(key);
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const getArticles = async () => {
    setIsLoading(true);
    try {
      let filters = [];

      const requiredFieldsFilter = `(title!="" && info!="" && files!="" && description!="")`;

      if (params.category) {
        filters.push(`category="${params.category}"`);
      }

      if (params.search) {
        filters.push(`(title~"${params.search}" || info~"${params.search}")`);
      }

      filters.push(requiredFieldsFilter);

      const filterString = filters.length ? filters.join(' && ') : '';

      const resultList = await pb.collection('articles').getList(currentPage, postsPerPage, {
        sort: '-created',
        filter: filterString,
        expand: "category",
      });

      setTotalItems(resultList.totalItems)
      setTotal(resultList.totalPages)

      setArticles(resultList.items);
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error);
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


  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getArticles();
  }, [params.search, params.pageSize, params.category]);


  return (
    <section className='mt-2 min-h-[500px] pb-[50px]'>
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList className="h-9">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('main')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("articles")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>


        <div className='mt-8 flex gap-6 justify-between'>
          <div className='flex justify-between items-center w-full mb-6 max-md:gap-5 max-md:flex-col'>
            <div className="max-md:w-full">
              <h3 className='text-2xl/[31.2px] max-sm:text-xl/[26px] font-semibold'>
                {categories.find(el => el.id == params.category)
                  ? t("category_article", { category: categories.find(el => el.id == params.category)?.name })
                  : t("articles_all_categories")}
              </h3>
              <h4 className='mt-1.5 text-sm/[18px]'>{t("questions_found", { count: totalItems })}</h4>
            </div>
            <form onSubmit={(e) => submitSearch(e)} className='relative max-lg:max-w-[320px] max-md:max-w-full max-w-[480px] w-full'>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-12" placeholder={t("articles_search")} />
              <button type='submit' className='cursor-pointer absolute top-1/2 -translate-y-1/2 right-4'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 22L20 20" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        <div className="flex gap-6 max-lg:flex-col max-lg:gap-10">
          <div className='grow w-full'>
            <Articles total={total} postsPerPage={postsPerPage} currentPage={currentPage} isLoading={isLoading} articles={articles} />
          </div>
          <div className='py-4 min-w-[278px] rounded-[20px] h-fit bg-background flex flex-col gap-2.5'>
            <h3 className='px-4 text-brand -tracking-[0.64px] text-2xl font-extrabold'>{t("articles_topics")}</h3>
            <Categories categories={categories} isLoading={iscategoryLoading} />
          </div>
        </div>
      </div >
    </section >
  );
};

const Articles = ({ total, postsPerPage, currentPage, isLoading, articles }) => {
  const t = useTranslations();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

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
    <div className="min-h-[300px] flex flex-col justify-between">
      <ul className="grid grid-cols-3 max-md:grid-cols-2 [@media(max-width:576px)]:grid-cols-1 gap-6 mb-8">
        {articles.map((_, index) => (
          <li style={{
            boxShadow: "0px 2px 16px 0px #4215041C"
          }}
            key={index}
            className={`w-full cursor-pointer relative overflow-hidden rounded-[20px] bg-background`}
          >
            <Link href={`/articles/${_.id}`} className='w-full h-full justify-between flex flex-col'>
              <div>
                <img src={getFileUrl(_.collectionId, _.id, _.files)}
                  alt={`img ${_.id}`} />
              </div>
              <div className="grow flex flex-col justify-between gap-2 p-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#FBB04C] font-medium">
                    {_.expand.category.name}
                  </h3>
                  <h3 className="text-text font-bold text-lg/[23px]">
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
          </li>
        ))}
      </ul>
      <div>
        <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={total}
          pageSizeSelectOptions={{
            pageSizeOptions: [5, 10, 25, 50],
          }}
        />
      </div>
    </div>
  )
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

      return `${pathname}?${newSearchParams.toString()}`;
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
      {categories.map((_, index) => (
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

export default ArticlesPage;
