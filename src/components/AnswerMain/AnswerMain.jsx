'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import PocketBase from 'pocketbase';
import styles from "./AnswerMain.module.scss"

const pb = new PocketBase("https://back.fatvo.saidoff.uz");


export default function AsnwerMain() {
  const t = useTranslations('')
  return (
    <section className="bg-background">
      <div className="container flex gap-4 [@media(max-width:992px)]:flex-col-reverse">
        <div className="w-2/3 [@media(max-width:992px)]:w-full min-h-[200px] bg-[#fffde7] flex flex-col border-t border-t-[3px] border-[#bcde98] pt-4 pb-3 px-3">
          <div className="flex justify-center items-center text-[#3c7101] gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="!w-5 !h-5 bi bi-chat-right-text-fill" viewBox="0 0 16 16">
              <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1" />
            </svg>
            <h3 className="text-[#3c7101] text-2xl font-semibold">{t("popular")}</h3>
          </div>
          <Questions />
          <div className="flex justify-end mt-auto">
            <Link href={'/popular'} className="flex items-center gap-1.5 text-[#3c7101] duration-300 hover:text-[#7aaf3e]">
              <h3 className="font-semibold">{t('more')}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="!w-6 !h-6 bi bi-three-dots" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="w-1/3 [@media(max-width:992px)]:w-full bg-[#ecf2e3] flex flex-col border-t border-t-[3px] border-[#bcde98] pt-4 pb-3 px-3">
          <div className="flex justify-center items-center h-8 text-[#3c7101] gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="!w-5 !h-5 bi bi-tags-fill" viewBox="0 0 16 16">
              <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
              <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043z" />
            </svg>
            <h3 className="text-[#3c7101] text-xl font-semibold">{t('categories')}</h3>
          </div>
          <Categories />
          <div className="flex justify-end mt-auto">
            <Link href={'/categories'} className="flex items-center gap-1.5 text-[#3c7101] duration-300 hover:text-[#7aaf3e]">
              <h3 className="font-semibold">{t('more')}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="!w-6 !h-6 bi bi-three-dots" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('question_categories').getList(1, 6, {
        sort: '-created',
        fields: 'name,id'
      });

      setCategories(records.items);
    } catch (error) {
      console.log('Ошибка при получении категорий:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCategories();

  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center mt-6 min-h-[100px]'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }


  if (!categories.length) {
    return (
      <div className='flex items-center justify-center min-h-[300px] font-semibold text-[#b5b5b5] select-none'>Empty</div>
    )
  }

  return (
    <ul className="grid grid-cols-1 [@media(max-width:992px)]:grid-cols-2 [@media(max-width:576px)]:!grid-cols-1 gap-2 mt-5 mb-5">
      {categories.map((_, index) => (
        <Link
          href={`/categories/topics/${_.id}`}
          key={index}
          className="w-full flex items-center gap-2 justify-between px-2 py-3 text-[#b5b5b5] cursor-pointer bg-background drop-shadow"
        >
          <div className="w-7 h-7 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="!w-5 !h-5 bi bi-bookmark-star-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.18.18 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.18.18 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.18.18 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.18.18 0 0 1-.134-.098z" />
            </svg>
          </div>
          <h3 className="grow text-foreground font-medium line-clamp-2">
            {_.name}
          </h3>
        </Link>
      ))}
    </ul>
  )
}

const Questions = () => {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getQuestions = async () => {
    setIsLoading(true);
    try {
      const resultList = await pb.collection('question_answers').getList(1, 10, {
        sort: '-views',
        fields: 'title,titleLat,id,created,isSaved',
        filter: '(answer != "" || answerLat != "" || answerCyr != "") && scope != "private"',
      });

      setQuestions(resultList.items);
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const setFavQuestion = async (id) => {
    const data = {
      "user": pb.authStore.record.id,
      "qa": id
    };

    try {
      const record = await pb.collection('user_favourite_qas').create(data);

    } catch (e) {
      console.log(e);
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
    getQuestions();

  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center mt-6 min-h-[100px]'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }


  if (!questions.length) {
    return (
      <div className='flex items-center justify-center min-h-[300px] font-semibold text-[#b5b5b5] select-none'>Empty</div>
    )
  }


  return (
    <ul className="flex flex-col gap-2 mt-5 mb-5">
      {questions.map((_, index) => (
        <li
          key={index}

          className={`${styles.box} relative w-full text-[#b5b5b5] hover:bg-brand hover:text-background cursor-pointer bg-background drop-shadow`}
        >
          <button onClick={() => setFavQuestion(_.id)} className="w-7 h-7 top-1/2 left-1.5 [@media(max-width:576px)]:top-4 [@media(max-width:576px)]:translate-y-0 -translate-y-1/2 absolute z-[11] flex items-center justify-center group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="!w-5 !h-5 bi bi-bookmarks group-hover:hidden"
              viewBox="0 0 16 16"
            >
              <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z" />
              <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="!w-5 !h-5 bi bi-bookmarks-fill hidden group-hover:block"
              viewBox="0 0 16 16"
            >
              <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5z" />
              <path d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1z" />
            </svg>
          </button>

          <div onClick={() => router.push(`/answers/${_.id}`)} className='w-full [@media(max-width:576px)]:flex-col [@media(max-width:576px)]:pb-1 px-2 py-3 relative pl-10 z-[10] flex items-start gap-2 justify-between'>
            <h3 className="grow text-foreground box-hover:text-background pr-2 font-medium">
              {_.titleLat}
            </h3>
            <h3 className="font-semibold [@media(max-width:576px)]:text-end [@media(max-width:576px)]:w-full text-nowrap">{formatDate(_.created)}</h3>
          </div>
        </li>
      ))}
    </ul>
  )
}