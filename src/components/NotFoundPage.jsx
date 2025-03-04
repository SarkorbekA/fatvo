import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <section className='pb-[70px] max-sm:pb-8'>
      <div className="container">
        <img draggable="false" className='aspect-[1060/620] max-sm:aspect-[800/620] max-sm:mt-[30px] select-none object-contain w-full' src="/404.png" alt="error" />
        <div className='flex items-center flex-col -mt-[20px] max-sm:mt-[10px]'>
          <h1 className='text-text font-bold text-[30px]/[38px] [@media(max-width:400px)]:text-[24px]/[28px] text-center'>
            {t("error_occurred")}
          </h1>
          <p className='text-[#9E9996] text-center font-medium text-lg [@media(max-width:400px)]:text-base mt-2'>{t("page_not_found")}</p>

          <Button asChild >
            <Link href="/" className='mt-[30px] [@media(max-width:400px)]:mt-4 [@media(max-width:400px)]:text-sm'>
              <h3>{t("go_home")}</h3>
              <svg className='!w-5 !h-5' width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4914 3.19949L14.4916 3.19968L20.2516 7.22961C20.2516 7.22964 20.2516 7.22966 20.2516 7.22968C20.7208 7.55815 21.1651 8.09671 21.4925 8.72389C21.82 9.35111 22.0083 10.0243 22.0083 10.6V17.38C22.0083 19.6539 20.1621 21.5 17.8883 21.5H7.10828C4.83583 21.5 2.98828 19.6453 2.98828 17.37V10.47C2.98828 9.93556 3.15867 9.29648 3.45686 8.69086C3.75491 8.08551 4.15935 7.55688 4.5858 7.22425L4.5859 7.22417L9.59453 3.31524C9.59475 3.31507 9.59496 3.3149 9.59518 3.31473C10.932 2.27943 13.1011 2.22541 14.4914 3.19949ZM12.4983 19.25C13.1844 19.25 13.7483 18.6861 13.7483 18V15C13.7483 14.3139 13.1844 13.75 12.4983 13.75C11.8121 13.75 11.2483 14.3139 11.2483 15V18C11.2483 18.6861 11.8121 19.25 12.4983 19.25Z" fill="white" stroke="white" />
              </svg>
            </Link>
          </Button>

        </div>
      </div>
    </section>
  );
}