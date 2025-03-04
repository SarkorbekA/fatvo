"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import PocketBase from "pocketbase";
const pb = new PocketBase("https://back.fatvo.saidoff.uz");
pb.autoCancellation(false)

const baseUrl = "https://back.fatvo.saidoff.uz/api/files/";

const getFileUrl = (collectionId, recordId, fileName) => {
  return `${baseUrl}${collectionId}/${recordId}/${fileName}`;
};

function BooksSection() {
  const t = useTranslations('')

  return (
    <section className="py-16 max-sm:pt-8">
      <div className="container flex flex-col">
        <div className="flex items-end justify-between w-full mb-10 gap-4 max-sm:mb-5">
          <div>
            <h4 className="text-brand uppercase font-medium text-xl/[20px] [@media(max-width:576px)]:text-base/[16px]">{t('library')}</h4>
            <h3 className="mt-3 [@media(max-width:576px)]:mt-1 [@media(max-width:576px)]:text-[22px]/[28px] font-extrabold text-[40px]/[52px] -tracking-[0.64px] max-w-[750px]">{t("most_viewed_books")}</h3>
          </div>
          <Button size="lg" className="max-md:hidden" asChild>
            <Link href="/books">
              <h3>{t("all_books")}</h3>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 2.5H16.5C18.1547 2.5 19.2543 2.97026 19.9461 3.71523C20.6441 4.4669 21 5.57665 21 7V17C21 18.4234 20.6441 19.5331 19.9461 20.2848C19.2543 21.0297 18.1547 21.5 16.5 21.5H8.5C6.8453 21.5 5.74565 21.0297 5.0539 20.2848C4.35591 19.5331 4 18.4234 4 17V7C4 5.57665 4.35591 4.4669 5.0539 3.71523C5.74565 2.97026 6.8453 2.5 8.5 2.5ZM12.5 11.75H8.5C7.81386 11.75 7.25 12.3139 7.25 13C7.25 13.6861 7.81386 14.25 8.5 14.25H12.5C13.1861 14.25 13.75 13.6861 13.75 13C13.75 12.3139 13.1861 11.75 12.5 11.75ZM8.5 18.25H16.5C17.1861 18.25 17.75 17.6861 17.75 17C17.75 16.3139 17.1861 15.75 16.5 15.75H8.5C7.81386 15.75 7.25 16.3139 7.25 17C7.25 17.6861 7.81386 18.25 8.5 18.25ZM17 9.75H19C19.6861 9.75 20.25 9.18614 20.25 8.5C20.25 7.81386 19.6861 7.25 19 7.25H17C16.5861 7.25 16.25 6.91386 16.25 6.5V4.5C16.25 3.81386 15.6861 3.25 15 3.25C14.3139 3.25 13.75 3.81386 13.75 4.5V6.5C13.75 8.29614 15.2039 9.75 17 9.75Z" fill="white" stroke="white" />
              </svg>
            </Link>
          </Button>
        </div>
        <Books />
        <Button size="lg" className="mx-auto md:hidden [@media(max-width:576px)]:w-full" asChild>
          <Link href="/books">
            <h3>{t("all_books")}</h3>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 2.5H16.5C18.1547 2.5 19.2543 2.97026 19.9461 3.71523C20.6441 4.4669 21 5.57665 21 7V17C21 18.4234 20.6441 19.5331 19.9461 20.2848C19.2543 21.0297 18.1547 21.5 16.5 21.5H8.5C6.8453 21.5 5.74565 21.0297 5.0539 20.2848C4.35591 19.5331 4 18.4234 4 17V7C4 5.57665 4.35591 4.4669 5.0539 3.71523C5.74565 2.97026 6.8453 2.5 8.5 2.5ZM12.5 11.75H8.5C7.81386 11.75 7.25 12.3139 7.25 13C7.25 13.6861 7.81386 14.25 8.5 14.25H12.5C13.1861 14.25 13.75 13.6861 13.75 13C13.75 12.3139 13.1861 11.75 12.5 11.75ZM8.5 18.25H16.5C17.1861 18.25 17.75 17.6861 17.75 17C17.75 16.3139 17.1861 15.75 16.5 15.75H8.5C7.81386 15.75 7.25 16.3139 7.25 17C7.25 17.6861 7.81386 18.25 8.5 18.25ZM17 9.75H19C19.6861 9.75 20.25 9.18614 20.25 8.5C20.25 7.81386 19.6861 7.25 19 7.25H17C16.5861 7.25 16.25 6.91386 16.25 6.5V4.5C16.25 3.81386 15.6861 3.25 15 3.25C14.3139 3.25 13.75 3.81386 13.75 4.5V6.5C13.75 8.29614 15.2039 9.75 17 9.75Z" fill="white" stroke="white" />
            </svg>
          </Link>
        </Button>
      </div>
    </section>
  )
}

const Books = () => {
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
      const resultList = await pb.collection('books').getList(1, 8, {
        sort: '-created',
        expand: "author"
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
    <div className="flex flex-col justify-between">
      <ul className='grid grid-cols-4 [@media(max-width:992px)]:grid-cols-3 max-md:!grid-cols-2 gap-6 mb-8 [@media(max-width:480px)]:mb-6'>
        {books.map((_, index) => (
          <li key={index} className='bg-background rounded-[20px] [@media(max-width:480px)]:rounded-2.5 overflow-hidden flex flex-col justify-between'>
            <Link href={`/books/${_.id}`} className='w-full h-full [@media(max-width:480px)]:h-[185px] aspect-[278/337] flex flex-col p-4 [@media(max-width:480px)]:p-2'>
              <div className='flex justify-between items-center'>
                <h3 className='text-brand flex items-center gap-1 border border-[#D9D2CE] rounded-lg py-[5px] px-2 className="[@media(max-width:480px)]:w-[8.8px] [@media(max-width:480px)]:rounded-[4.4px] [@media(max-width:480px)]:!p-[3.3px]'>
                  <svg width="16" className="[@media(max-width:480px)]:w-[8.8px] [@media(max-width:480px)]:h-[8.8px]" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
                  </svg>
                  <span className='text-[#9E9996] text-xs/[12px] [@media(max-width:480px)]:text-[6.6px]/[6.6px]'>{formatDate(_.created)}</span>
                </h3>
                <h3 className='text-brand flex items-center gap-1 border border-[#D9D2CE] rounded-lg py-[5px] px-2 className="[@media(max-width:480px)]:w-[8.8px] [@media(max-width:480px)]:rounded-[4.4px] [@media(max-width:480px)]:!p-[3.3px]'>
                  <svg className="[@media(max-width:480px)]:w-[8.8px] [@media(max-width:480px)]:h-[8.8px]" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.3866 8.00001C10.3866 9.32001 9.31995 10.3867 7.99995 10.3867C6.67995 10.3867 5.61328 9.32001 5.61328 8.00001C5.61328 6.68001 6.67995 5.61334 7.99995 5.61334C9.31995 5.61334 10.3866 6.68001 10.3866 8.00001Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1266 14.0732 9.72665C14.6732 8.78665 14.6732 7.20665 14.0732 6.26665C12.5466 3.86665 10.3532 2.47998 7.9999 2.47998C5.64656 2.47998 3.45323 3.86665 1.92656 6.26665C1.32656 7.20665 1.32656 8.78665 1.92656 9.72665C3.45323 12.1266 5.64656 13.5133 7.9999 13.5133Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className='text-[#9E9996] text-xs/[12px] [@media(max-width:480px)]:text-[6.6px]/[6.6px]'>{_.views}</span>
                </h3>
              </div>
              <h3 className="mt-2 [@media(max-width:480px)]:mt-1 text-[#FBB04C] text-sm/[14px] font-medium [@media(max-width:480px)]:text-[7.7px]/[7.7px]">{_.expand.author.name}</h3>
              <h3 className="mt-1 [@media(max-width:480px)]:mt-0.5 font-bold text-[20px]/[26px] line-clamp-2 h-[52px] [@media(max-width:480px)]:h-[28px] [@media(max-width:480px)]:text-[11px]/[14px]">{_.title}</h3>
              <div className="mt-2 grow">
                <img loading="lazy" className="aspect-[379/200] w-full h-full object-contain" src={getFileUrl(_.collectionId, _.id, _.image)}
                  alt={`img ${_.id}`} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


export default BooksSection;