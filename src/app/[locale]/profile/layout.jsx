'use client'

import Loader from '@/components/Loader/Loader';
import useAuthStore from '@/stores/auth-store';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useTranslations } from 'next-intl';

export default function ProfileLayout({ children }) {
  const t = useTranslations()
  const { isLoggedIn } = useAuthStore();

  return (
    <section className="mt-2 min-h-[60vh]">
      <div className='container'>
        <Breadcrumb>
          <BreadcrumbList className="h-9">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('main')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("my-profile")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {children}
      </div>
      {!isLoggedIn && < Loader />}
    </section>
  );
}


