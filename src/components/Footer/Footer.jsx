import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="mt-auto border-t border-[#EDE6E2] relative z-[20]">
      <div className="container">
        <div className="pt-16 max-sm:pt-8 pb-10 flex justify-between items-start gap-x-[25px] max-lg:flex-col max-md:w-full gap-y-10">
          <div className="flex flex-col gap-6">
            <Link className="aspect-[248/90] h-[90px] [@media(max-width:576px)]:h-[60px] inline-block" href="/">
              <img className="h-full object-contain" src="/logo.png" alt="logo" />
            </Link>
            <p className="font-medium text-black max-w-[380px] max-md:max-w-full">
              {t('site_description')}
            </p>
          </div>
          <div className="flex max-w-[750px] max-md:justify-start max-md:gap-x-16 max-md:flex-wrap gap-x-[20px] max-md:max-w-full w-full justify-between [@media(max-width:576px)]:flex-col gap-y-10">
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-text text-lg/[23px]">{t('pages')}</h3>
              <ul className="flex flex-col gap-4">
                <li className="leading-[16px]">
                  <Link href="/questions" className="text-text leading-[16px] lg:hover:text-brand duration-200 inline-block font-medium" >
                    {t("questions-and-answers")}
                  </Link>
                </li>
                <li className="leading-[16px]">
                  <Link className="text-text leading-[16px] lg:hover:text-brand duration-200 inline-block font-medium" href="/fatwas">
                    {t("fatwas")}
                  </Link>
                </li>
                <li className="leading-[16px]">
                  <Link className="text-text leading-[16px] lg:hover:text-brand duration-200 inline-block font-medium" href="/articles">
                    {t("articles")}
                  </Link>
                </li>
                <li className="leading-[16px]">
                  <Link className="text-text leading-[16px] lg:hover:text-brand duration-200 inline-block font-medium" href="/books">
                    {t("books")}
                  </Link>
                </li>
                <li className="leading-[16px]">
                  <Link className="text-text leading-[16px] lg:hover:text-brand duration-200 inline-block font-medium" href="/media">
                    {t("media")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-text text-lg/[23px]">{t("social_networks")}</h3>
                <ul className="flex gap-5 items-center">
                  <li>
                    <Link className="w-10 h-10 inline-block" target="_blank" href="https://t.me/diniysavollar">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.68425 19.5366C14.2609 16.82 18.6464 15.029 20.8406 14.1637C27.1058 11.6931 28.4076 11.264 29.2561 11.2496C29.4427 11.2467 29.86 11.2905 30.1303 11.4985C30.3585 11.6741 30.4213 11.9112 30.4514 12.0777C30.4814 12.2442 30.5188 12.6234 30.4891 12.9197C30.1496 16.3018 28.6805 24.5092 27.9332 28.2971C27.6169 29.9 26.9943 30.4374 26.3914 30.49C25.0813 30.6043 24.0865 29.6691 22.8176 28.8805C20.8321 27.6465 19.7103 26.8784 17.783 25.6742C15.5556 24.2826 16.9996 23.5178 18.2689 22.2678C18.6011 21.9407 24.3734 16.9629 24.4851 16.5113C24.4991 16.4548 24.5121 16.2443 24.3802 16.1331C24.2483 16.022 24.0536 16.06 23.9131 16.0902C23.7139 16.1331 20.542 18.1208 14.3972 22.0534C13.4969 22.6395 12.6813 22.9251 11.9507 22.9101C11.1452 22.8936 9.59571 22.4783 8.44385 22.1234C7.03103 21.6879 5.90816 21.4577 6.00594 20.7183C6.05686 20.3331 6.6163 19.9392 7.68425 19.5366Z" fill="#FBB04C" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link className="w-10 h-10 inline-block" target="_blank" href="https://x.com/fatvouz">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.552 10L17.8023 21.0312L9.5 30.0002H11.3687L18.6375 22.1476L24.5103 30.0002H30.869L22.1543 18.3486L29.8821 10H28.0134L21.3194 17.2319L15.9107 10H9.552ZM12.2999 11.3763H15.2211L28.1206 28.6239H25.1995L12.2999 11.3763Z" fill="#FBB04C" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link className="w-10 h-10 inline-block" target="_blank" href="https://www.youtube.com/c/Fatvouzb">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M31.6375 13.9058C31.3313 12.812 30.5656 12.0308 29.4938 11.7183C27.6563 11.2495 19.8469 11.2495 19.8469 11.2495C19.8469 11.2495 12.1906 11.2495 10.2 11.7183C9.12813 12.0308 8.3625 12.812 8.05625 13.9058C7.75 15.937 7.75 19.9995 7.75 19.9995C7.75 19.9995 7.75 24.062 8.20938 26.0933C8.51563 27.187 9.28125 27.9683 10.3531 28.2808C12.1906 28.7495 20 28.7495 20 28.7495C20 28.7495 27.6562 28.7495 29.6469 28.2808C30.7187 27.9683 31.4844 27.187 31.7906 26.0933C32.25 24.062 32.25 19.9995 32.25 19.9995C32.25 19.9995 32.25 15.937 31.6375 13.9058ZM17.55 23.7495V16.2495L23.9813 19.9995L17.55 23.7495Z" fill="#FBB04C" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link className="w-10 h-10 inline-block" target="_blank" href="https://www.instagram.com/fatvouz/">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.5 9H14.5C11.4753 9 9 11.4742 9 14.5V25.5C9 28.5247 11.4753 31 14.5 31H25.5C28.5247 31 31 28.5247 31 25.5V14.5C31 11.4742 28.5247 9 25.5 9ZM20 24.5832C17.4683 24.5832 15.4166 22.5305 15.4166 20C15.4166 17.4683 17.4683 15.4166 20 15.4166C22.5305 15.4166 24.5834 17.4683 24.5834 20C24.5834 22.5305 22.5305 24.5832 20 24.5832ZM25.9584 15.4166C25.1983 15.4166 24.5834 14.8008 24.5834 14.0416C24.5834 13.2823 25.1983 12.6666 25.9584 12.6666C26.7185 12.6666 27.3334 13.2823 27.3334 14.0416C27.3334 14.8008 26.7185 15.4166 25.9584 15.4166Z" fill="#FBB04C" />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-text text-lg/[23px]">{t("if_you_have_question")}</h3>
                <Button variant="outline" className="py-4 w-fit px-5" asChild>
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
                    <h3 className="font-semibold text-xl/[24px]">{t("ask-question")}</h3>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col max-md:max-w-full gap-4 max-w-[250px]">
              <h3 className="font-bold text-text text-lg/[23px]">{t('to-contact')}</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="tel:+998781503344" className="flex items-center gap-2">
                    <div className="min-w-8 w-8 h-8 rounded-md bg-[#1306011F] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.3077 15.2748C18.3077 15.5748 18.241 15.8832 18.0993 16.1832C17.9577 16.4832 17.7744 16.7665 17.5327 17.0332C17.1244 17.4832 16.6743 17.8082 16.166 18.0165C15.666 18.2248 15.1244 18.3332 14.541 18.3332C13.691 18.3332 12.7827 18.1332 11.8243 17.7248C10.866 17.3165 9.90768 16.7665 8.95768 16.0748C7.99935 15.3748 7.09102 14.5998 6.22435 13.7415C5.36602 12.8748 4.59102 11.9665 3.89935 11.0165C3.21602 10.0665 2.66602 9.1165 2.26602 8.17484C1.86602 7.22484 1.66602 6.3165 1.66602 5.44984C1.66602 4.88317 1.76602 4.3415 1.96602 3.8415C2.16602 3.33317 2.48268 2.8665 2.92435 2.44984C3.45768 1.92484 4.04102 1.6665 4.65768 1.6665C4.89102 1.6665 5.12435 1.7165 5.33268 1.8165C5.54935 1.9165 5.74102 2.0665 5.89102 2.28317L7.82435 5.00817C7.97435 5.2165 8.08268 5.40817 8.15768 5.5915C8.23268 5.7665 8.27435 5.9415 8.27435 6.09984C8.27435 6.29984 8.21602 6.49984 8.09935 6.6915C7.99102 6.88317 7.83268 7.08317 7.63268 7.28317L6.99935 7.9415C6.90768 8.03317 6.86602 8.1415 6.86602 8.27484C6.86602 8.3415 6.87435 8.39984 6.89102 8.4665C6.91602 8.53317 6.94102 8.58317 6.95768 8.63317C7.10768 8.90817 7.36602 9.2665 7.73268 9.69984C8.10768 10.1332 8.50768 10.5748 8.94102 11.0165C9.39102 11.4582 9.82435 11.8665 10.266 12.2415C10.6993 12.6082 11.0577 12.8582 11.341 13.0082C11.3827 13.0248 11.4327 13.0498 11.491 13.0748C11.5577 13.0998 11.6243 13.1082 11.6993 13.1082C11.841 13.1082 11.9493 13.0582 12.041 12.9665L12.6743 12.3415C12.8827 12.1332 13.0827 11.9748 13.2743 11.8748C13.466 11.7582 13.6577 11.6998 13.866 11.6998C14.0243 11.6998 14.191 11.7332 14.3743 11.8082C14.5577 11.8832 14.7494 11.9915 14.9577 12.1332L17.716 14.0915C17.9327 14.2415 18.0827 14.4165 18.1743 14.6248C18.2577 14.8332 18.3077 15.0415 18.3077 15.2748Z" stroke="#130601" strokeWidth="1.5" strokeMiterlimit="10" />
                        <path d="M15.4167 7.49967C15.4167 6.99967 15.025 6.23301 14.4417 5.60801C13.9083 5.03301 13.2 4.58301 12.5 4.58301" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.3333 7.49984C18.3333 4.27484 15.725 1.6665 12.5 1.6665" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-text font-medium">+998 (78) 150 3344</h3>
                  </Link>
                </li>
                <li>
                  <Link href="mailto:fatvo.uz@mail.ru" className="flex items-center gap-2">
                    <div className="min-w-8 w-8 h-8 rounded-md bg-[#1306011F] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.49935 18.3332H12.4993C16.666 18.3332 18.3327 16.6665 18.3327 12.4998V7.49984C18.3327 3.33317 16.666 1.6665 12.4993 1.6665H7.49935C3.33268 1.6665 1.66602 3.33317 1.66602 7.49984V12.4998C1.66602 16.6665 3.33268 18.3332 7.49935 18.3332Z" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1.66602 10.8335H4.79935C5.43268 10.8335 6.00768 11.1919 6.29102 11.7585L7.03268 13.2502C7.49935 14.1669 8.33268 14.1669 8.53268 14.1669H11.4743C12.1077 14.1669 12.6827 13.8085 12.966 13.2419L13.7077 11.7502C13.991 11.1835 14.566 10.8252 15.1993 10.8252H18.316" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.61719 5.8335H11.3922" stroke="#130601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.91602 8.3335H12.0827" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-text font-medium">fatvo.uz@mail.ru</h3>
                  </Link>
                </li>
                <li>
                  <Link href="https://yandex.uz/maps/-/CHqKAC7z" className="flex items-center gap-2">
                    <div className="min-w-8 w-8 h-8 rounded-md bg-[#1306011F] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0004 11.1917C11.4363 11.1917 12.6004 10.0276 12.6004 8.5917C12.6004 7.15576 11.4363 5.9917 10.0004 5.9917C8.56445 5.9917 7.40039 7.15576 7.40039 8.5917C7.40039 10.0276 8.56445 11.1917 10.0004 11.1917Z" stroke="#130601" strokeWidth="1.5" />
                        <path d="M3.01675 7.07484C4.65842 -0.141827 15.3501 -0.133494 16.9834 7.08317C17.9417 11.3165 15.3084 14.8998 13.0001 17.1165C11.3251 18.7332 8.67508 18.7332 6.99175 17.1165C4.69175 14.8998 2.05842 11.3082 3.01675 7.07484Z" stroke="#130601" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <h3 className="text-text font-medium">{t("address")}</h3>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#EDE6E2] py-[11px]">
        <div className="container">
          <h3 className="text-sm max-sm:text-center max-sm:text-xs leading-[18.2px] text-[#596066]">Copyright ©2025 <Link className="text-brand leading-[18.2px]" href="/">www.fatvo.uz</Link></h3>
        </div>
      </div>
    </footer>
  );
}