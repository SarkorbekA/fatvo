"use client"

import { useRouter, usePathname, Link } from '@/i18n/routing';
import useAuthStore from '@/stores/auth-store';
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from 'react';
import { useLocale } from "next-intl";
import { useTranslations } from 'next-intl';
import PocketBase from 'pocketbase';

const pb = new PocketBase("https://back.fatvo.saidoff.uz");
pb.autoCancellation(false)

const baseUrl = "https://back.fatvo.saidoff.uz/api/files/"

import styles from './Header.module.scss';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import AuthChecker from '@/components/AuthChecker';

export default function Header() {
  const t = useTranslations('');

  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isLoginOpen, setIsLoginOpen, setIsLoggedIn, isRegisterOpen, setIsRegisterOpen, checkAuth } = useAuthStore();
  const { toast } = useToast()

  const [isBurgerOpen, setIsBurgerOpen] = useState(false)

  const handleLogOut = () => {
    setIsLoggedIn(false)
    setIsBurgerOpen(false)
    if (pathname === '/ask') {
      router.replace('/login');
    }

    if (pathname === '/profile') {
      router.replace('/');
    }

    localStorage.removeItem('pocketbase_auth')

    toast({
      duration: 1500,
      title: t("logout-success"),
    })
  }

  return (
    <header className='relative z-[20] bg-[#FDFBF6]'>
      <div className='flex items-center justify-between container'>
        <Link className='aspect-[248/90] h-[85px] max-lg:h-[80px] [@media(max-width:576px)]:h-[60px] inline-block' href="/">
          <img src="/logo.png" alt="logo" />
        </Link>
        <nav className='max-lg:hidden'>
          <ul className='flex items-center gap-5'>
            <li>
              <Link href="/" className={`${pathname == '/' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 relative font-medium text-text`}>
                {t('main')}
              </Link>
            </li>
            <li>
              <Link href="/questions" className={`${pathname == '/questions' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 relative font-medium text-text`}>
                {t('questions-and-answers')}
              </Link>
            </li>
            <li>
              <Link href="/fatwas" className={`${pathname == '/fatwas' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 relative font-medium text-text`}>
                {t('fatwas')}
              </Link>
            </li>
            <li>
              <Link href="/articles" className={`${pathname == '/articles' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 relative font-medium text-text`}>
                {t('articles')}
              </Link>
            </li>
            <li>
              <Link href="/books" className={`${pathname == '/books' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 relative font-medium text-text`}>
                {t('books')}
              </Link>
            </li>
            <li>
              <Link href="/media" className={`${pathname == '/media' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 relative font-medium text-text`}>
                {t('media')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className='flex items-center gap-6 max-lg:hidden'>
          <Translations />

          {!isLoggedIn && (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <button className='bg-[#FDFBF6] border border-brand rounded-lg py-[11px] px-4 flex items-center gap-2.5'>
                  <h3 className='text-brand font-semibold text-xl leading-5'>{t('login')}</h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.90039 7.55999C9.21039 3.95999 11.0604 2.48999 15.1104 2.48999H15.2404C19.7104 2.48999 21.5004 4.27999 21.5004 8.74999V15.27C21.5004 19.74 19.7104 21.53 15.2404 21.53H15.1104C11.0904 21.53 9.24039 20.08 8.91039 16.54" stroke="#19ae7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12H14.88" stroke="#19ae7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.6504 8.65002L16.0004 12L12.6504 15.35" stroke="#19ae7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </DialogTrigger>
              <DialogContent className="p-0 dialog gap-0 max-w-[378px]">
                <DialogHeader className="flex h-[50px] px-5 flex-row items-center justify-between">
                  <DialogTitle className="text-text font-medium">{t("login-profile")}</DialogTitle>
                  <DialogDescription className="hidden text-balance text-muted-foreground">
                    {t('login-to-account')}
                  </DialogDescription>
                  <DialogClose>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.16992 14.83L14.8299 9.17001" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14.8299 14.83L9.16992 9.17001" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </DialogClose>
                </DialogHeader>
                <LoginForm id={1} onLogin={() => {
                  toast({
                    title: t("success-login"),
                  })
                }} />
              </DialogContent>
            </Dialog>
          )}

          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-1.5'>
                  {pb.authStore?.record?.avatar.length > 0 && <div className='w-12 h-12 rounded-full overflow-hidden'>
                    <img className='w-full h-full select-none' src={`${baseUrl}${pb.authStore.record.collectionId}/${pb.authStore.record.id}/${pb.authStore?.record?.avatar}`} alt="avatar" />
                  </div>
                  }
                  {!pb.authStore?.record?.avatar.length && <div className='w-12 h-12 rounded-full flex items-center justify-center text-brand border'>
                    <svg className="!w-8 !h-8 bi bi-person-circle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                  </div>
                  }
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9L12 16L5 9" stroke="#130601" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] p-0">
                <DropdownMenuItem asChild className="cursor-pointer rounded-none hover:!bg-brand/[0.1] px-4 py-2.5">
                  <Link href={'/profile'} className='flex gap-2.5 items-center'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.0007 10C12.3018 10 14.1673 8.13454 14.1673 5.83335C14.1673 3.53217 12.3018 1.66669 10.0007 1.66669C7.69946 1.66669 5.83398 3.53217 5.83398 5.83335C5.83398 8.13454 7.69946 10 10.0007 10Z" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.1585 18.3333C17.1585 15.1083 13.9501 12.5 10.0001 12.5C6.05013 12.5 2.8418 15.1083 2.8418 18.3333" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3> {t('my-profile')}</h3>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogOut()} className="cursor-pointer rounded-none hover:!bg-brand/[0.1] px-4 py-2.5 text-[#F52D2D]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.41602 6.30001C7.67435 3.30001 9.21602 2.07501 12.591 2.07501H12.6993C16.4243 2.07501 17.916 3.56668 17.916 7.29168V12.725C17.916 16.45 16.4243 17.9417 12.6993 17.9417H12.591C9.24102 17.9417 7.69935 16.7333 7.42435 13.7833" stroke="#F52D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.5009 10H3.01758" stroke="#F52D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.87565 7.20831L2.08398 9.99998L4.87565 12.7916" stroke="#F52D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className='text-[#F52D2D]'>{t('log-out')}</h3>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Sheet open={isBurgerOpen} onOpenChange={setIsBurgerOpen}>
          <SheetTrigger asChild>
            <button className='w-6 h-6 flex items-center justify center lg:hidden'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7H21" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 12H21" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 17H21" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="pt-14">
            <SheetHeader className="hidden">
              <SheetTitle>Burger menu</SheetTitle>
              <SheetDescription>
                Burger Menu
              </SheetDescription>
            </SheetHeader>
            <div className='flex justify-between items-center'>
              {!isLoggedIn && (
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <button onClick={() => setIsBurgerOpen(false)} className='bg-[#19AD7C] rounded-lg py-2 px-4 flex items-center gap-1.5'>
                      <h3 className='text-background font-semibold text-base leading-5'>{t('login')}</h3>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.90039 7.55999C9.21039 3.95999 11.0604 2.48999 15.1104 2.48999H15.2404C19.7104 2.48999 21.5004 4.27999 21.5004 8.74999V15.27C21.5004 19.74 19.7104 21.53 15.2404 21.53H15.1104C11.0904 21.53 9.24039 20.08 8.91039 16.54" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12H14.88" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.6504 8.65002L16.0004 12L12.6504 15.35" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="p-0 dialog gap-0 max-w-[378px]">
                    <DialogHeader className="flex h-[50px] px-5 flex-row items-center justify-between">
                      <DialogTitle className="text-text font-medium">{t("login-profile")}</DialogTitle>
                      <DialogDescription className="hidden text-balance text-muted-foreground">
                        {t('login-to-account')}
                      </DialogDescription>
                      <DialogClose>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.16992 14.83L14.8299 9.17001" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.8299 14.83L9.16992 9.17001" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </DialogClose>
                    </DialogHeader>
                    <LoginForm id={2} onLogin={() => {
                      toast({
                        title: t("success-login"),
                      })
                    }} />
                  </DialogContent>
                </Dialog>
              )}


              {isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='flex items-center gap-1.5'>
                      {pb.authStore?.record?.avatar.length > 0 && <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img className='w-full h-full select-none' src={`${baseUrl}${pb.authStore.record.collectionId}/${pb.authStore.record.id}/${pb.authStore?.record?.avatar}`} alt="avatar" />
                      </div>
                      }
                      {!pb.authStore?.record?.avatar.length && <div className='w-12 h-12 rounded-full flex items-center justify-center text-brand border'>
                        <svg className="!w-8 !h-8 bi bi-person-circle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                      </div>
                      }
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9L12 16L5 9" stroke="#130601" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[180px] p-0">
                    <DropdownMenuItem asChild className="cursor-pointer rounded-none hover:!bg-[#bcdd9738] px-4 py-2.5">
                      <Link href={'/profile'} onClick={() => setIsBurgerOpen(false)} className='flex gap-2.5 items-center'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0007 10C12.3018 10 14.1673 8.13454 14.1673 5.83335C14.1673 3.53217 12.3018 1.66669 10.0007 1.66669C7.69946 1.66669 5.83398 3.53217 5.83398 5.83335C5.83398 8.13454 7.69946 10 10.0007 10Z" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17.1585 18.3333C17.1585 15.1083 13.9501 12.5 10.0001 12.5C6.05013 12.5 2.8418 15.1083 2.8418 18.3333" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className='text-nowrap'> {t('my-profile')}</h3>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleLogOut()} className="cursor-pointer rounded-none hover:!bg-[#bcdd9738] px-4 py-2.5 text-[#F52D2D]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.41602 6.30001C7.67435 3.30001 9.21602 2.07501 12.591 2.07501H12.6993C16.4243 2.07501 17.916 3.56668 17.916 7.29168V12.725C17.916 16.45 16.4243 17.9417 12.6993 17.9417H12.591C9.24102 17.9417 7.69935 16.7333 7.42435 13.7833" stroke="#F52D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.5009 10H3.01758" stroke="#F52D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.87565 7.20831L2.08398 9.99998L4.87565 12.7916" stroke="#F52D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <h3 className='text-nowrap'>{t('log-out')}</h3>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Translations onChange={() => {
                setIsBurgerOpen(false)
              }} />
            </div>
            <nav className='mt-4'>
              <ul className='flex items-center gap-2 flex-col'>
                <li className='w-full'>
                  <Link href="/" onClick={() => setIsBurgerOpen(false)} className={`${pathname == '/' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 max-lg:py-3 relative font-medium text-text`}>
                    {t('main')}
                  </Link>
                </li>
                <li className='w-full'>
                  <Link href="/questions" onClick={() => setIsBurgerOpen(false)} className={`${pathname == '/questions' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 max-lg:py-3 relative font-medium text-text`}>
                    {t('questions-and-answers')}
                  </Link>
                </li>
                <li className='w-full'>
                  <Link href="/fatwas" onClick={() => setIsBurgerOpen(false)} className={`${pathname == '/fatwas' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 max-lg:py-3 relative font-medium text-text`}>
                    {t('fatwas')}
                  </Link>
                </li>
                <li className='w-full'>
                  <Link href="/articles" onClick={() => setIsBurgerOpen(false)} className={`${pathname == '/articles' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 max-lg:py-3 relative font-medium text-text`}>
                    {t('articles')}
                  </Link>
                </li>
                <li className='w-full'>
                  <Link href="/books" onClick={() => setIsBurgerOpen(false)} className={`${pathname == '/books' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 max-lg:py-3 relative font-medium text-text`}>
                    {t('books')}
                  </Link>
                </li>
                <li className='w-full'>
                  <Link href="/media" onClick={() => setIsBurgerOpen(false)} className={`${pathname == '/media' ? "after:!opacity-[1]" : ''} ${styles.item} py-2 max-lg:py-3 relative font-medium text-text`}>
                    {t('media')}
                  </Link>
                </li>
              </ul>
            </nav>

          </SheetContent>
        </Sheet>


        {!isLoggedIn && (
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>

            </DialogTrigger>
            <DialogContent className="p-0 dialog gap-0 max-w-[378px]">
              <DialogHeader className="flex h-[50px] px-5 flex-row items-center justify-between">
                <DialogTitle className="text-text font-medium">{t("create-account")}</DialogTitle>
                <DialogDescription className="hidden text-balance text-muted-foreground">
                  {t('login-to-account')}
                </DialogDescription>
                <DialogClose>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.16992 14.83L14.8299 9.17001" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.8299 14.83L9.16992 9.17001" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </DialogClose>
              </DialogHeader>
              <RegisterForm onLogin={() => {
                toast({
                  title: t("success-login"),
                })
              }} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <AuthChecker />
    </header>
  );
}


const locales = [
  {
    title: "English",
    sub: "En",
    key: "en",
    icon: <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_270_60793)">
        <rect width="16" height="10" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M-2 -3H18V12H-2V-3Z" fill="#E31D1C" />
        <path fillRule="evenodd" clipRule="evenodd" d="M-2 -1.75V-0.5H18V-1.75H-2ZM-2 0.75V2H18V0.75H-2ZM-2 4.5V3.25H18V4.5H-2ZM-2 5.75V7H18V5.75H-2ZM-2 9.5V8.25H18V9.5H-2ZM-2 12V10.75H18V12H-2Z" fill="#F7FCFF" />
        <rect x="-2" y="-3" width="11.25" height="8.75" fill="#2E42A5" />
        <path fillRule="evenodd" clipRule="evenodd" d="M-0.69998 -0.282754L-0.03758 -0.744168L0.476244 -0.374252H0.185318L0.773653 0.14612L0.574939 0.875748H0.263704L-0.0385058 0.205627L-0.296236 0.875748H-1.06468L-0.476347 1.39612L-0.69998 2.21725L-0.03758 1.75583L0.476244 2.12575H0.185318L0.773653 2.64612L0.574939 3.37575H0.263704L-0.0385058 2.70563L-0.296236 3.37575H-1.06468L-0.476347 3.89612L-0.69998 4.71725L-0.03758 4.25583L0.603338 4.71725L0.404072 3.89612L0.918783 3.37575H0.681373L1.21242 3.00583L1.72624 3.37575H1.43532L2.02365 3.89612L1.80002 4.71725L2.46242 4.25583L3.10334 4.71725L2.90407 3.89612L3.41878 3.37575H3.18137L3.71242 3.00583L4.22624 3.37575H3.93532L4.52365 3.89612L4.30002 4.71725L4.96242 4.25583L5.60334 4.71725L5.40407 3.89612L5.91878 3.37575H5.68137L6.21242 3.00583L6.72624 3.37575H6.43532L7.02365 3.89612L6.80002 4.71725L7.46242 4.25583L8.10334 4.71725L7.90407 3.89612L8.41878 3.37575H7.7637L7.46149 2.70563L7.20376 3.37575H6.83113L6.65407 2.64612L7.16878 2.12575H6.93137L7.46242 1.75583L8.10334 2.21725L7.90407 1.39612L8.41878 0.875748H7.7637L7.46149 0.205627L7.20376 0.875748H6.83113L6.65407 0.14612L7.16878 -0.374252H6.93137L7.46242 -0.744168L8.10334 -0.282754L7.90407 -1.10388L8.41878 -1.62425H7.7637L7.46149 -2.29437L7.20376 -1.62425H6.43532L7.02365 -1.10388L6.82494 -0.374252H6.5137L6.21149 -1.04437L5.95376 -0.374252H5.58113L5.40407 -1.10388L5.91878 -1.62425H5.2637L4.96149 -2.29437L4.70376 -1.62425H3.93532L4.52365 -1.10388L4.32494 -0.374252H4.0137L3.71149 -1.04437L3.45376 -0.374252H3.08113L2.90407 -1.10388L3.41878 -1.62425H2.7637L2.46149 -2.29437L2.20376 -1.62425H1.43532L2.02365 -1.10388L1.82494 -0.374252H1.5137L1.21149 -1.04437L0.953764 -0.374252H0.581134L0.404072 -1.10388L0.918783 -1.62425H0.263704L-0.0385058 -2.29437L-0.296236 -1.62425H-1.06468L-0.476347 -1.10388L-0.69998 -0.282754ZM6.82494 2.12575L7.02365 1.39612L6.43532 0.875748H6.72624L6.21242 0.505832L5.68137 0.875748H5.91878L5.40407 1.39612L5.58113 2.12575H5.95376L6.21149 1.45563L6.5137 2.12575H6.82494ZM5.47624 2.12575L4.96242 1.75583L4.43137 2.12575H4.66878L4.15407 2.64612L4.33113 3.37575H4.70376L4.96149 2.70563L5.2637 3.37575H5.57494L5.77365 2.64612L5.18532 2.12575H5.47624ZM3.27365 2.64612L3.07494 3.37575H2.7637L2.46149 2.70563L2.20376 3.37575H1.83113L1.65407 2.64612L2.16878 2.12575H1.93137L2.46242 1.75583L2.97624 2.12575H2.68532L3.27365 2.64612ZM3.45376 2.12575H3.08113L2.90407 1.39612L3.41878 0.875748H3.18137L3.71242 0.505832L4.22624 0.875748H3.93532L4.52365 1.39612L4.32494 2.12575H4.0137L3.71149 1.45563L3.45376 2.12575ZM1.82494 2.12575L2.02365 1.39612L1.43532 0.875748H1.72624L1.21242 0.505832L0.681373 0.875748H0.918783L0.404072 1.39612L0.581133 2.12575H0.953764L1.21149 1.45563L1.5137 2.12575H1.82494ZM5.77365 0.14612L5.57494 0.875748H5.2637L4.96149 0.205627L4.70376 0.875748H4.33113L4.15407 0.14612L4.66878 -0.374252H4.43137L4.96242 -0.744168L5.47624 -0.374252H5.18532L5.77365 0.14612ZM2.97624 -0.374252L2.46242 -0.744168L1.93137 -0.374252H2.16878L1.65407 0.14612L1.83113 0.875748H2.20376L2.46149 0.205627L2.7637 0.875748H3.07494L3.27365 0.14612L2.68532 -0.374252H2.97624Z" fill="#F7FCFF" />
      </g>
      <defs>
        <clipPath id="clip0_270_60793">
          <rect width="16" height="10" fill="white" />
        </clipPath>
      </defs>
    </svg>

  },
  {
    title: "Русский",
    sub: "Ру",
    key: "ru",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.8017 2.75861H1.19828C0.536469 2.75861 0 3.29507 0 3.95689V6.25286H16V3.95689C16 3.29507 15.4635 2.75861 14.8017 2.75861Z" fill="#F5F5F5" />
      <path d="M0 12.0431C0 12.7049 0.536469 13.2414 1.19828 13.2414H14.8017C15.4635 13.2414 16 12.7049 16 12.0431V9.74713H0V12.0431Z" fill="#FF4B55" />
      <path d="M16 6.25281H0V9.74687H16V6.25281Z" fill="#41479B" />
    </svg>
  },
  {
    title: "O'zbekcha",
    sub: "O'z",
    key: "uz",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.8017 2.75861H1.19828C0.536469 2.75861 0 3.29507 0 3.95689V5.94248H16V3.95689C16 3.29507 15.4635 2.75861 14.8017 2.75861Z" fill="#82AFFF" />
      <path d="M0 12.0431C0 12.7049 0.536469 13.2414 1.19828 13.2414H14.8017C15.4635 13.2414 16 12.7049 16 12.0431V10.0575H0V12.0431Z" fill="#73AF00" />
      <path d="M16 6.37811H0V9.62155H16V6.37811Z" fill="#F5F5F5" />
      <path d="M0 6.25285V6.37816H16V6.25285V5.94244H0V6.25285Z" fill="#FF4B55" />
      <path d="M0 9.74708V10.0575H16V9.74708V9.62177H0V9.74708Z" fill="#FF4B55" />
      <path d="M3.54646 5.37725C2.98171 5.37725 2.52393 4.92056 2.52393 4.35784C2.52393 3.79306 2.98168 3.33431 3.54646 3.33431C3.54865 3.33431 3.55077 3.33431 3.5529 3.33434C3.58615 3.33478 3.5978 3.29062 3.56849 3.2749C3.39459 3.18168 3.19612 3.12893 2.98512 3.13046C2.30937 3.13528 1.76046 3.69525 1.76765 4.371C1.77471 5.03978 2.32146 5.58112 2.99396 5.58112C3.20205 5.58112 3.39774 5.52846 3.56949 5.43653C3.59871 5.42087 3.5869 5.37671 3.55377 5.37718C3.55127 5.37725 3.54887 5.37725 3.54646 5.37725Z" fill="#F5F5F5" />
      <path d="M4.34801 5.09532L4.30235 5.23226L4.15801 5.23335C4.13932 5.23348 4.13157 5.25735 4.1466 5.26845L4.26273 5.3542L4.21916 5.49182C4.21354 5.50963 4.23382 5.52438 4.24904 5.51351L4.36648 5.42957L4.48391 5.51351C4.49913 5.52438 4.51938 5.50963 4.51379 5.49182L4.47023 5.3542L4.58632 5.26845C4.60135 5.25735 4.5936 5.23348 4.57491 5.23335L4.43057 5.23226L4.38491 5.09532C4.37901 5.0776 4.35395 5.0776 4.34801 5.09532Z" fill="#F5F5F5" />
      <path d="M5.36363 5.09532L5.31798 5.23226L5.17363 5.23335C5.15495 5.23348 5.1472 5.25735 5.16223 5.26845L5.27832 5.3542L5.23476 5.49182C5.22913 5.50963 5.24941 5.52438 5.26463 5.51351L5.38207 5.42957L5.49951 5.51351C5.51473 5.52438 5.53498 5.50963 5.52938 5.49182L5.48582 5.3542L5.60191 5.26845C5.61695 5.25735 5.6092 5.23348 5.59051 5.23335L5.44616 5.23226L5.40051 5.09532C5.3946 5.0776 5.36951 5.0776 5.36363 5.09532Z" fill="#F5F5F5" />
      <path d="M6.38121 5.09532L6.33555 5.23226L6.19121 5.23335C6.17252 5.23348 6.16477 5.25735 6.17981 5.26845L6.29593 5.3542L6.25237 5.49182C6.24674 5.50963 6.26702 5.52438 6.28224 5.51351L6.39968 5.42957L6.51712 5.51351C6.53234 5.52438 6.55259 5.50963 6.54699 5.49182L6.50343 5.3542L6.61952 5.26845C6.63456 5.25735 6.6268 5.23348 6.60812 5.23335L6.46377 5.23226L6.41812 5.09532C6.41221 5.0776 6.38712 5.0776 6.38121 5.09532Z" fill="#F5F5F5" />
      <path d="M7.39879 5.09532L7.35313 5.23226L7.20879 5.23335C7.1901 5.23348 7.18235 5.25735 7.19738 5.26845L7.31348 5.3542L7.26991 5.49182C7.26429 5.50963 7.28457 5.52438 7.29979 5.51351L7.41723 5.42957L7.53466 5.51351C7.54988 5.52438 7.57013 5.50963 7.56454 5.49182L7.52098 5.3542L7.63707 5.26845C7.6521 5.25735 7.64435 5.23348 7.62566 5.23335L7.48132 5.23226L7.43566 5.09532C7.42979 5.0776 7.4047 5.0776 7.39879 5.09532Z" fill="#F5F5F5" />
      <path d="M8.41441 5.09532L8.36876 5.23226L8.22441 5.23335C8.20573 5.23348 8.19798 5.25735 8.21301 5.26845L8.32913 5.3542L8.28557 5.49182C8.27995 5.50963 8.30023 5.52438 8.31545 5.51351L8.43288 5.42957L8.55032 5.51351C8.56554 5.52438 8.58579 5.50963 8.5802 5.49182L8.53663 5.3542L8.65276 5.26845C8.66779 5.25735 8.66004 5.23348 8.64135 5.23335L8.49701 5.23226L8.45135 5.09532C8.44538 5.0776 8.42032 5.0776 8.41441 5.09532Z" fill="#F5F5F5" />
      <path d="M5.36363 4.14621L5.31798 4.28315L5.17363 4.28424C5.15495 4.28437 5.1472 4.30824 5.16223 4.31933L5.27832 4.40508L5.23476 4.54271C5.22913 4.56052 5.24941 4.57527 5.26463 4.5644L5.38207 4.48046L5.49951 4.5644C5.51473 4.57527 5.53498 4.56052 5.52938 4.54271L5.48582 4.40508L5.60191 4.31933C5.61695 4.30824 5.6092 4.28437 5.59051 4.28424L5.44616 4.28315L5.40051 4.14621C5.3946 4.12843 5.36951 4.12843 5.36363 4.14621Z" fill="#F5F5F5" />
      <path d="M6.38121 4.14621L6.33555 4.28315L6.19121 4.28424C6.17252 4.28437 6.16477 4.30824 6.17981 4.31933L6.29593 4.40508L6.25237 4.54271C6.24674 4.56052 6.26702 4.57527 6.28224 4.5644L6.39968 4.48046L6.51712 4.5644C6.53234 4.57527 6.55259 4.56052 6.54699 4.54271L6.50343 4.40508L6.61952 4.31933C6.63456 4.30824 6.6268 4.28437 6.60812 4.28424L6.46377 4.28315L6.41812 4.14621C6.41221 4.12843 6.38712 4.12843 6.38121 4.14621Z" fill="#F5F5F5" />
      <path d="M7.39879 4.14621L7.35313 4.28315L7.20879 4.28424C7.1901 4.28437 7.18235 4.30824 7.19738 4.31933L7.31348 4.40508L7.26991 4.54271C7.26429 4.56052 7.28457 4.57527 7.29979 4.5644L7.41723 4.48046L7.53466 4.5644C7.54988 4.57527 7.57013 4.56052 7.56454 4.54271L7.52098 4.40508L7.63707 4.31933C7.6521 4.30824 7.64435 4.28437 7.62566 4.28424L7.48132 4.28315L7.43566 4.14621C7.42979 4.12843 7.4047 4.12843 7.39879 4.14621Z" fill="#F5F5F5" />
      <path d="M8.41441 4.14621L8.36876 4.28315L8.22441 4.28424C8.20573 4.28437 8.19798 4.30824 8.21301 4.31933L8.32913 4.40508L8.28557 4.54271C8.27995 4.56052 8.30023 4.57527 8.31545 4.5644L8.43288 4.48046L8.55032 4.5644C8.56554 4.57527 8.58579 4.56052 8.5802 4.54271L8.53663 4.40508L8.65276 4.31933C8.66779 4.30824 8.66004 4.28437 8.64135 4.28424L8.49701 4.28315L8.45135 4.14621C8.44538 4.12843 8.42032 4.12843 8.41441 4.14621Z" fill="#F5F5F5" />
      <path d="M6.38121 5.09532L6.33555 5.23226L6.19121 5.23335C6.17252 5.23348 6.16477 5.25735 6.17981 5.26845L6.29593 5.3542L6.25237 5.49182C6.24674 5.50963 6.26702 5.52438 6.28224 5.51351L6.39968 5.42957L6.51712 5.51351C6.53234 5.52438 6.55259 5.50963 6.54699 5.49182L6.50343 5.3542L6.61952 5.26845C6.63456 5.25735 6.6268 5.23348 6.60812 5.23335L6.46377 5.23226L6.41812 5.09532C6.41221 5.0776 6.38712 5.0776 6.38121 5.09532Z" fill="#F5F5F5" />
      <path d="M6.38121 3.197L6.33555 3.33394L6.19121 3.33504C6.17252 3.33516 6.16477 3.35904 6.17981 3.37013L6.29593 3.45588L6.25237 3.5935C6.24674 3.61132 6.26702 3.62607 6.28224 3.61519L6.39968 3.53125L6.51712 3.61519C6.53234 3.62607 6.55259 3.61132 6.54699 3.5935L6.50343 3.45588L6.61952 3.37013C6.63456 3.35904 6.6268 3.33516 6.60812 3.33504L6.46377 3.33394L6.41812 3.197C6.41221 3.17929 6.38712 3.17929 6.38121 3.197Z" fill="#F5F5F5" />
      <path d="M7.39879 5.09532L7.35313 5.23226L7.20879 5.23335C7.1901 5.23348 7.18235 5.25735 7.19738 5.26845L7.31348 5.3542L7.26991 5.49182C7.26429 5.50963 7.28457 5.52438 7.29979 5.51351L7.41723 5.42957L7.53466 5.51351C7.54988 5.52438 7.57013 5.50963 7.56454 5.49182L7.52098 5.3542L7.63707 5.26845C7.6521 5.25735 7.64435 5.23348 7.62566 5.23335L7.48132 5.23226L7.43566 5.09532C7.42979 5.0776 7.4047 5.0776 7.39879 5.09532Z" fill="#F5F5F5" />
      <path d="M8.41441 5.09532L8.36876 5.23226L8.22441 5.23335C8.20573 5.23348 8.19798 5.25735 8.21301 5.26845L8.32913 5.3542L8.28557 5.49182C8.27995 5.50963 8.30023 5.52438 8.31545 5.51351L8.43288 5.42957L8.55032 5.51351C8.56554 5.52438 8.58579 5.50963 8.5802 5.49182L8.53663 5.3542L8.65276 5.26845C8.66779 5.25735 8.66004 5.23348 8.64135 5.23335L8.49701 5.23226L8.45135 5.09532C8.44538 5.0776 8.42032 5.0776 8.41441 5.09532Z" fill="#F5F5F5" />
      <path d="M7.39879 3.197L7.35313 3.33394L7.20879 3.33504C7.1901 3.33516 7.18235 3.35904 7.19738 3.37013L7.31348 3.45588L7.26991 3.5935C7.26429 3.61132 7.28457 3.62607 7.29979 3.61519L7.41723 3.53125L7.53466 3.61519C7.54988 3.62607 7.57013 3.61132 7.56454 3.5935L7.52098 3.45588L7.63707 3.37013C7.6521 3.35904 7.64435 3.33516 7.62566 3.33504L7.48132 3.33394L7.43566 3.197C7.42979 3.17929 7.4047 3.17929 7.39879 3.197Z" fill="#F5F5F5" />
      <path d="M8.41441 3.197L8.36876 3.33394L8.22441 3.33504C8.20573 3.33516 8.19798 3.35904 8.21301 3.37013L8.32913 3.45588L8.28557 3.5935C8.27995 3.61132 8.30023 3.62607 8.31545 3.61519L8.43288 3.53125L8.55032 3.61519C8.56554 3.62607 8.58579 3.61132 8.5802 3.5935L8.53663 3.45588L8.65276 3.37013C8.66779 3.35904 8.66004 3.33516 8.64135 3.33504L8.49701 3.33394L8.45135 3.197C8.44538 3.17929 8.42032 3.17929 8.41441 3.197Z" fill="#F5F5F5" />
    </svg>
  },
]

const Translations = ({ onChange }) => {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border border-[#EDE6E2] rounded-lg text-sm flex items-center px-2 py-1 max-lg:py-2 text-text gap-[3px]">
          <span className='w-5 h-5'>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.491 1.66669H6.50768C3.47435 1.66669 1.66602 3.47502 1.66602 6.50835V13.4834C1.66602 16.525 3.47435 18.3334 6.50768 18.3334H13.4827C16.516 18.3334 18.3243 16.525 18.3243 13.4917V6.50835C18.3327 3.47502 16.5243 1.66669 13.491 1.66669ZM14.166 14.5584C12.741 14.5584 11.4077 13.9417 10.341 12.8C9.13268 13.8917 7.55768 14.5584 5.83268 14.5584C5.49102 14.5584 5.20768 14.275 5.20768 13.9334C5.20768 13.5917 5.49102 13.3084 5.83268 13.3084C8.72435 13.3084 11.116 11.0167 11.4243 8.08335H9.99935H5.84102C5.49935 8.08335 5.21602 7.80002 5.21602 7.45835C5.21602 7.11669 5.49935 6.84169 5.84102 6.84169H9.37435V6.06669C9.37435 5.72502 9.65768 5.44169 9.99935 5.44169C10.341 5.44169 10.6243 5.72502 10.6243 6.06669V6.84169H12.0327C12.0493 6.84169 12.066 6.83335 12.0827 6.83335C12.0993 6.83335 12.116 6.84169 12.1327 6.84169H14.1577C14.4993 6.84169 14.7827 7.12502 14.7827 7.46669C14.7827 7.80835 14.4993 8.09169 14.1577 8.09169H12.6743C12.5493 9.51669 12.016 10.825 11.1993 11.8917C12.0327 12.8167 13.0743 13.3167 14.166 13.3167C14.5077 13.3167 14.791 13.6 14.791 13.9417C14.791 14.2834 14.5077 14.5584 14.166 14.5584Z" fill="#FBB04C" />
            </svg>
          </span>
          <h3 className='text-base font-medium'>{locales.find((el) => el.key == locale).sub}</h3>
          <span className='w-5 h-5'>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8327 7.5L9.99935 13.3333L4.16602 7.5" stroke="#130601" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset="1" align={'end'} className="w-[90px] min-w-[90px] z-[51] p-0 rounded-lg">
        <ul className="grid">
          {locales.filter((el) => el.key != locale).map((el, index) => (
            <DropdownMenuItem asChild className={`py-1.5 px-4 duration-300 cursor-pointer hover:bg-[#bdde98] ${index !== locales.filter((el) => el.key != locale).length - 1 ? "border-b" : ""}`} onClick={() => onChange ? onChange() : null} key={el.key}>
              <Link href={pathname} locale={el.key}
                className="py-2.5 px-4 duration-300 cursor-pointer hover:bg-[#bdde98] flex gap-2 items-center">
                {el.icon}
                {el.sub}
              </Link>
            </DropdownMenuItem>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}