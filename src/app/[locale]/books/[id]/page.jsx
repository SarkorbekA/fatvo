"use client";

import React, { useState, useCallback, useEffect } from "react";

import Loader from "@/components/Loader/Loader";
import PocketBase from "pocketbase";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const pb = new PocketBase("https://back.fatvo.saidoff.uz");

pb.autoCancellation(false)

import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const baseUrl = "https://back.fatvo.saidoff.uz/api/files/";

const getFileUrl = (collectionId, recordId, fileName) => {
  return `${baseUrl}${collectionId}/${recordId}/${fileName}`;
};

function BooksDetailPage({ params }) {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState();
  const param = React.use(params);


  const getBook = async () => {
    setIsLoading(true);
    try {
      const record = await pb.collection("books").getOne(param.id, {
        expand: "author",
      });

      setBook(record);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };


  useEffect(() => {
    getBook();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <section className="mt-2 min-h-[500px] pb-[55px]">
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList className="h-9">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('main')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/books">{t("books")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="w-[calc(100%-180px)] max-sm:w-[calc(100%-165px)]">
              <BreadcrumbPage>{book?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>


        <div className='flex gap-6 mt-8 justify-between max-md:gap-16 max-md:flex-col'>
          <div className="grow">
            <div className="w-full">
              <img
                className="object-contain w-full mdh-[650px] sm:h-[500px]"
                alt={book?.title}
                src={getFileUrl(book.collectionId, book.id, book.image)}
              />
            </div>
            <div className="flex flex-col mt-4">
              <h3 className="font-semibold text-3xl/[36px] max-sm:text-2xl/[32px] mb-2">
                {book.title}
              </h3>
              <h4 className="font-semibold text-xl/[26px] max-lg:text-lg/[22px] text-[#FBB04C]">
                {book.expand.author.name}
              </h4>
              <div className='flex items-center mt-4 gap-3'>
                <h3 className='text-brand flex items-center gap-1'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                  </svg>
                  <span className='text-[#9E9996]'>{formatDate(book.created)}</span>
                </h3>
                <h3 className='text-brand flex items-center gap-1'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.3866 8.00001C10.3866 9.32001 9.31995 10.3867 7.99995 10.3867C6.67995 10.3867 5.61328 9.32001 5.61328 8.00001C5.61328 6.68001 6.67995 5.61334 7.99995 5.61334C9.31995 5.61334 10.3866 6.68001 10.3866 8.00001Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1266 14.0732 9.72665C14.6732 8.78665 14.6732 7.20665 14.0732 6.26665C12.5466 3.86665 10.3532 2.47998 7.9999 2.47998C5.64656 2.47998 3.45323 3.86665 1.92656 6.26665C1.32656 7.20665 1.32656 8.78665 1.92656 9.72665C3.45323 12.1266 5.64656 13.5133 7.9999 13.5133Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className='text-[#9E9996]'>{book.views}</span>
                </h3>
              </div>
              <p className="mt-4 text-medium text-base/[20px] text-text"
                dangerouslySetInnerHTML={{ __html: book?.description }}
              ></p>
              <a download target="_blank" href={getFileUrl(book.collectionId, book.id, book.file)} className="w-full max-w-[350px] flex items-center justify-between gap-2.5 mt-4 px-4 py-3 rounded-xl bg-[#19AD7C1F]">
                <span className="truncate ...">{book.file}</span>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.4258 15.5734L15.8391 18.9867L19.2524 15.5734"
                    stroke="#19AD7C"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.8398 5.33337V18.8934"
                    stroke="#19AD7C"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M26.6673 16.24C26.6673 22.1333 22.6673 26.9067 16.0007 26.9067C9.33398 26.9067 5.33398 22.1333 5.33398 16.24"
                    stroke="#19AD7C"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="w-full max-md:w-full sm:min-w-[278px] sm:w-[278px]">
            <h2 className="font-semibold text-[28px] max-sm:text-xl/[26px] text-black mb-4">
              {t("other_books")}
            </h2>
            <Books id={param.id} />
          </div>
        </div>
      </div>
    </section>
  );
}


const Books = ({ id }) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const getBooks = async () => {
    setIsLoading(true);
    try {
      const resultList = await pb.collection('books').getList(1, 3, {
        sort: '-created',
        expand: "author",
        filter: `id != "${id}"`,
      });

      setBooks(resultList.items);
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);


  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }

  if (!books.length) {
    return (
      <div className='flex items-center justify-center min-h-[200px] text-sm font-semibold text-[#9E9996] select-none'>{t('empty')}</div>
    )
  }

  return (
    <ul className='md:flex flex-col max-sm:gap-4 gap-6 sm:min-h-[300px] max-md:w-full max-md:grid sm:grid-cols-2 [@media(min-width:577px)]:grid-cols-2'>
      {books.map((_, index) => (
        <li key={index} className='bg-background rounded-[20px] overflow-hidden flex flex-col justify-between'>
          <Link href={`/books/${_.id}`} className='w-full h-full aspect-[278/337] flex flex-col p-4'>
            <div className='flex justify-between items-center'>
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
            <h3 className="mt-2 text-[#FBB04C] text-sm/[14px] font-medium">{_.expand.author.name}</h3>
            <h3 className="mt-1 font-bold text-[20px]/[26px] line-clamp-2 h-[52px]">{_.title}</h3>
            <div className="mt-2 grow">
              <img className="aspect-[379/200] w-full h-full object-contain" src={getFileUrl(_.collectionId, _.id, _.image)}
                alt={`img ${_.id}`} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default BooksDetailPage;
