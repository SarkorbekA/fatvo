'use client'

import { use, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Loader from '@/components/Loader/Loader';
import useAuthStore from '@/stores/auth-store';
import PocketBase from 'pocketbase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
const baseUrl = "https://back.fatvo.saidoff.uz/api/files/"
const pb = new PocketBase("https://back.fatvo.saidoff.uz");

pb.autoCancellation(false)

function ProfilePage() {
  const { toast } = useToast()
  const t = useTranslations();
  const router = useRouter();
  const initialData = {
    name: "",
    email: "",
  };

  const { setIsLoggedIn } = useAuthStore();
  const [isUserLoading, setIsUserLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [user, setUser] = useState(initialData);
  const [initialUser, setInitialUser] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false)
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)

  const [tabs, setTabs] = useState([
    {
      name: 'my_questions',
      title: t("my_questions_profile"),
      status: true
    },
    {
      name: 'saved',
      title: t("saved_questions_profile"),
      status: false
    }
  ])

  const handleTabClick = (index) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab, i) => ({
        ...tab,
        status: i === index
      }))
    );
  };

  const handleChange = (e) => {

    const { id, value } = e.target;

    const sanitizedValue = value.replace(/ {3,}/g, "  ");

    setInitialUser((prev) => ({
      ...prev,
      [id]: sanitizedValue,
    }));
  };

  const changeImage = async (e) => {
    if (e.target.files.length === 0) return;

    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t("invalid-file-type"),
      })
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsAvatarLoading(true);
      const record = await pb.collection('users').update(pb.authStore.record.id, formData);

      setUser(record)
      setInitialUser(record);

      router.refresh();
    } catch (error) {
      console.error("Ошибка при обновлении аватара:", error);
    } finally {
      setIsAvatarLoading(false);
      setIsEditOpen(false)
    }
  }

  const hasChanges = JSON.stringify(
    Object.fromEntries(Object.entries(user).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]))
  ) !== JSON.stringify(initialUser);

  const getUser = async () => {
    try {
      const user = await pb.collection('users').getOne(pb.authStore.record.id, { expand: 'region' });

      setUser(user)
      setInitialUser(user);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      toast({
        duration: 5000,
        title: t("no-changes"),
      })
      return;
    }

    const trimmedData = Object.fromEntries(
      Object.entries(initialUser).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    );

    setIsLoading(true)
    try {
      const record = await pb.collection('users').update(pb.authStore.record.id, trimmedData);

      const user = await pb.collection('users').getOne(record.id, { expand: 'region' });

      setUser(user)
      setInitialUser(user);

      toast({
        duration: 3000,
        title: t("changes-saved-successfully"),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
      setIsEditOpen(false)
    }
  };


  const checkAuth = async () => {
    try {
      const authData = await pb.collection('users').authRefresh();

      return true;
    } catch (error) {
      console.error('Ошибка при проверке аутентификации:', error);

      return false;
    }
  };

  const handleAuthCheck = async () => {
    const token = localStorage.getItem('pocketbase_auth');

    if (token) {
      const res = await checkAuth();

      if (!res) {
        router.replace('/login');
      } else {
        setTimeout(() => setIsUserLoading(false), 500);

        await getUser();

        setIsLoggedIn(true)
      }
    } else {
      router.replace('/');

      setTimeout(() => setIsUserLoading(false), 500);
    }
  };

  useEffect(() => {
    handleAuthCheck();
  }, []);


  if (isUserLoading) {
    return (
      <div>
        <Loader />
      </div>
    )
  }

  return (
    <div className='mt-20 mb-8 max-sm:mt-10'>
      <div className='flex flex-col items-center'>
        <div className='bg-[#FFFFFF] rounded-[20px] p-3 pb-0 w-full flex flex-col gap-4' style={{
          boxShadow: "0px 12px 32px 0px #4215040F"
        }}>
          <div className='w-full flex items-start justify-between max-sm:flex-col max-sm:items-center gap-4 max-sm:gap-6 max-sm:px-2'>
            <div className='flex gap-4 items-center max-sm:flex-col w-full'>
              <div className='p-1'>
                {user.avatar?.length > 0 && <div className='w-[120px] h-[120px] rounded-full overflow-hidden'>
                  <img draggable='false' className='w-full h-full select-none' src={`${baseUrl}${user.collectionId}/${user.id}/${user.avatar}`} alt="avatar" />
                </div>
                }
                {!user.avatar?.length && <div className='w-[120px] h-[120px] rounded-full flex items-center justify-center text-brand border'>
                  <svg className="!w-[100px] !h-[100px] bi bi-person-circle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                  </svg>
                </div>
                }
              </div>
              <div className='min-w-[280px] [@media(max-width:576px)]:min-w-[0] max-md:w-full max-sm:mt-2 flex flex-col gap-[5px] pr-1'>
                <h3 className='font-bold leading-[31.2px] max-sm:text-lg/[24px] text-text text-2xl'>{user.name}</h3>
                <div className='flex items-center gap-1 w-full'>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.7513 10.6917H14.8513C14.0346 10.6917 13.3096 11.1417 12.943 11.875L12.243 13.2583C12.0763 13.5917 11.743 13.8 11.3763 13.8H8.64297C8.38464 13.8 8.01797 13.7417 7.7763 13.2583L7.0763 11.8833C6.70964 11.1583 5.9763 10.7 5.16797 10.7H2.2513C1.9263 10.7 1.66797 10.9583 1.66797 11.2833V14C1.66797 17.025 3.48464 18.8333 6.51797 18.8333H13.5013C16.3596 18.8333 18.118 17.2667 18.3346 14.4833V11.275C18.3346 10.9583 18.0763 10.6917 17.7513 10.6917Z" fill="#19AD7C" />
                    <path d="M13.493 2.16666H6.50964C3.4763 2.16666 1.66797 3.97499 1.66797 7.00832V9.54166C1.8513 9.47499 2.0513 9.44166 2.2513 9.44166H5.16797C6.45964 9.44166 7.61797 10.1583 8.19297 11.3167L8.81797 12.5417H11.2013L11.8263 11.3083C12.4013 10.1583 13.5596 9.44166 14.8513 9.44166H17.7513C17.9513 9.44166 18.1513 9.47499 18.3346 9.54166V7.00832C18.3346 3.97499 16.5263 2.16666 13.493 2.16666ZM8.70964 5.00832H11.293C11.6096 5.00832 11.8763 5.26666 11.8763 5.58332C11.8763 5.90832 11.6096 6.16666 11.293 6.16666H8.70964C8.39297 6.16666 8.1263 5.90832 8.1263 5.58332C8.1263 5.26666 8.39297 5.00832 8.70964 5.00832ZM11.943 8.49166H8.05964C7.74297 8.49166 7.48464 8.23332 7.48464 7.91666C7.48464 7.59166 7.74297 7.33332 8.05964 7.33332H11.943C12.2596 7.33332 12.518 7.59166 12.518 7.91666C12.518 8.23332 12.2596 8.49166 11.943 8.49166Z" fill="#19AD7C" />
                  </svg>
                  <h3 className='text-[#9E9996] font-medium ... truncate [@media(max-width:576px)]:text-sm w-full max-sm:w-[calc(100%-24px)]'>{user.email}</h3>
                </div>
                <div className='flex gap-3 mt-1.5 [@media(max-width:576px)]:flex-col'>
                  {user?.expand?.region.name && <div className='border rounded-lg border-[#D9D2CE] py-1 px-4 border-dashed'>
                    <h4 className='text-[#9E9996] text-sm'>{t("region_profile")}</h4>
                    <h3 className='mt-1 font-medium text-text'>{user.expand.region.name}</h3>
                  </div>
                  }
                  {user?.gender && <div className='border rounded-lg border-[#D9D2CE] py-1 px-4 border-dashed'>
                    <h4 className='text-[#9E9996] text-sm'>{t("gender_profile")}</h4>
                    <h3 className='mt-1 font-medium text-text'>{t(user.gender)}</h3>
                  </div>
                  }
                </div>
              </div>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button className='bg-[#EDE6E2] w-fit ml-auto max-sm:w-full max-sm:py-2 gap-2 py-1 px-2 flex items-center justify-center rounded-lg'>
                  <h3 className='text-sm font-medium text-[#431E0C]'>{t("edit")}</h3>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.16797 1.66666H7.5013C3.33464 1.66666 1.66797 3.33332 1.66797 7.49999V12.5C1.66797 16.6667 3.33464 18.3333 7.5013 18.3333H12.5013C16.668 18.3333 18.3346 16.6667 18.3346 12.5V10.8333" stroke="#431E0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.3675 2.51666L6.80088 9.08333C6.55088 9.33333 6.30088 9.825 6.25088 10.1833L5.89254 12.6917C5.75921 13.6 6.40088 14.2333 7.30921 14.1083L9.81754 13.75C10.1675 13.7 10.6592 13.45 10.9175 13.2L17.4842 6.63333C18.6175 5.5 19.1509 4.18333 17.4842 2.51666C15.8175 0.849997 14.5009 1.38333 13.3675 2.51666Z" stroke="#431E0C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.4258 3.45834C12.9841 5.45001 14.5424 7.00834 16.5424 7.57501" stroke="#431E0C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </DialogTrigger>
              <DialogContent className="p-0 dialog gap-0 max-w-[378px]">
                <DialogHeader className="flex h-[50px] px-5 flex-row items-center justify-between">
                  <DialogTitle className="text-text font-medium text-left">{t("edit-profile")}</DialogTitle>
                  <DialogDescription className="hidden text-balance text-muted-foreground">
                    {t("edit-profile")}
                  </DialogDescription>
                  <DialogClose onClick={() => setUser(initialUser)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.16992 14.83L14.8299 9.17001" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14.8299 14.83L9.16992 9.17001" stroke="#9E9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </DialogClose>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='px-5 py-6 flex gap-6 flex-col w-full'>
                  <div className='flex flex-col items-center gap-4'>
                    <div className='relative rounded-full overflow-hidden'>
                      {user.avatar?.length > 0 && <div className='w-[120px] h-[120px] rounded-full overflow-hidden'>
                        <img className='w-full h-full' src={`${baseUrl}${user.collectionId}/${user.id}/${user.avatar}`} alt="avatar" />
                      </div>
                      }
                      {!user.avatar?.length && <div className='w-[120px] h-[120px] rounded-full flex items-center justify-center text-brand border'>
                        <svg className="!w-[100px] !h-[100px] bi bi-person-circle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                      </div>
                      }

                      <input onChange={(e) => changeImage(e)} accept="image/png, image/jpg, image/jpeg, image/webp"
                        type="file" name="file" id="file" className='absolute z-[-1] opacity-[0] top-0 left-0' />

                      {!isAvatarLoading && <label htmlFor='file' className='absolute cursor-pointer w-full h-full left-0 top-0 bg-text/[0.6] flex items-center justify-center [&_svg]:pointer-events-none [&_svg]:size-[38px] [&_svg]:shrink-0'>
                        <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.5 3.25H13.5C6 3.25 3 6.25 3 13.75V22.75C3 30.25 6 33.25 13.5 33.25H22.5C30 33.25 33 30.25 33 22.75V19.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M24.0608 4.78001L12.2408 16.6C11.7908 17.05 11.3408 17.935 11.2508 18.58L10.6058 23.095C10.3658 24.73 11.5208 25.87 13.1558 25.645L17.6708 25C18.3008 24.91 19.1858 24.46 19.6508 24.01L31.4708 12.19C33.5108 10.15 34.4708 7.78001 31.4708 4.78001C28.4708 1.78001 26.1008 2.74001 24.0608 4.78001Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22.3633 6.47498C23.3683 10.06 26.1733 12.865 29.7733 13.885L22.3633 6.47498Z" fill="white" />
                          <path d="M22.3633 6.47498C23.3683 10.06 26.1733 12.865 29.7733 13.885" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </label>}


                      {isAvatarLoading && <div className='absolute w-full h-full top-0 left-0 bg-text/[0.6] flex items-center justify-center'>
                        <div className='loading theme !w-7 !h-7'></div>
                      </div>}
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label htmlFor="name">{t('fio')}</Label>
                      <Input
                        id="name"
                        type="text"
                        onChange={handleChange}
                        placeholder={t('fullname')}
                        required
                        value={initialUser.name}
                      />
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        onChange={handleChange}
                        placeholder={t('input-email')}
                        required
                        value={initialUser.email}
                      />
                    </div>
                  </div>
                  <Button disabled={!hasChanges || isLoading}>
                    {!isLoading ? (
                      <>
                        <h3 className='text-xl/[20px]'>{t("save")}</h3>
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.5 22C18 22 22.5 17.5 22.5 12C22.5 6.5 18 2 12.5 2C7 2 2.5 6.5 2.5 12C2.5 17.5 7 22 12.5 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.25 12L11.08 14.83L16.75 9.17004" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    ) : (
                      <div className='loading !w-6 !h-6'></div>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className='border-t border-[#D9D2CE] mx-1 px-4.5 flex gap-2'>
            {tabs.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`${_.status ? "text-brand after:bg-brand" : "text-[#9E9996] after:bg-transparent"} 
                relative font-medium py-4 px-3 after:content-[''] after:block after:h-[2px] after:rounded-t-[3px] after:w-full after:absolute after:bottom-0 
                after:left-0 after:duration-300`}
              >
                {_.title}
              </button>
            ))}
          </div>
        </div>

        {tabs.find(el => el.status).name == "my_questions" ? (
          <div style={{
            boxShadow: "0px 12px 32px 0px #4215040F"
          }} className='rounded-[20px] [@media(max-width:576px)]:rounded-lg [@media(max-width:576px)]:p-4 bg-background p-6 mt-5 w-full flex flex-col gap-8'>
            <div>
              <h3 className='font-semibold text-2xl/[31px] mb-4'>{t("answered")}</h3>
              <MostRead status="answered" />
            </div>
            <div>
              <h3 className='font-semibold text-2xl/[31px] mb-4'>{t("question_sent")}</h3>
              <MostRead status="sent" />
            </div>
          </div>
        ) : (
          <div style={{
            boxShadow: "0px 12px 32px 0px #4215040F"
          }} className='rounded-[20px] [@media(max-width:576px)]:rounded-lg [@media(max-width:576px)]:p-4 bg-background p-6 mt-5 w-full flex flex-col gap-8'>
            <MostRead status="saved" />
          </div>
        )}
      </div>
    </div>
  );
}


function MostRead({ status }) {
  const t = useTranslations('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const getQuestions = async () => {
    setIsLoading(true);
    try {
      let filters = [];

      let requiredFieldsFilter;

      if (status != "saved") {
        if (status === 'answered') {
          requiredFieldsFilter = `(titleLat!="" && questionLat!="" && answerLat!="")`
        } else if (status === 'sent') {
          requiredFieldsFilter = `(titleLat!="" && questionLat!="" && answerLat="")`
        }
        filters.push(requiredFieldsFilter);
        filters.push(`user = '${pb.authStore.record.id}'`)
      } else {

      }

      const filterString = filters.length ? filters.join(' && ') : '';

      if (status == "saved") {
        const res = await pb.collection('user_favourite_qas').getFullList({
          sort: '-created',
          expand: 'qa,qa.category',
          filter: filterString,
        }
        );
        setQuestions(res.map(el => el.expand.qa));
      }
      else {
        const resultList = await pb.collection('question_answers').getFullList({
          sort: '-created',
          filter: filterString,
          fields: "title,expand,titleLat,qid,id,created,category,views"
        });

        setQuestions(resultList);
      }
    } catch (error) {
      console.error('Ошибка при получении вопросов:', error);
    } finally {
      setIsLoading(false);
    }
  }


  const renderContent = (_, status) => (
    <div className="flex flex-col gap-2">
      {status == "saved" ? (
        <h3 className="text-[#FBB04C] [@media(max-width:576px)]:text-sm/[14px] font-medium truncate ... w-full">
          {_.expand?.category?.name}
        </h3>
      ) : (
        <div className='flex w-full items-center gap-1 justify-between [@media(max-width:576px)]:items-start [@media(max-width:576px)]:flex-col [@media(max-width:576px)]:gap-2'>
          <h3 className="text-[#FBB04C] text-nowrap [@media(max-width:576px)]:text-sm/[14px] font-medium">
            {t("my_question")}
          </h3>
          {status == "answered" ? (
            <div className='flex items-center gap-1'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5389 6.82021L11.539 6.82027L11.5449 6.81417C11.9223 6.42372 11.9308 5.79828 11.5389 5.40644C11.1503 5.01785 10.5137 5.01785 10.1251 5.40644L7.05203 8.47956L5.87225 7.29977C5.48366 6.91118 4.84707 6.91118 4.45848 7.29977C4.06988 7.68837 4.06988 8.32495 4.45848 8.71355L6.34514 10.6002L6.6987 10.2467L6.34515 10.6002C6.53118 10.7862 6.78458 10.8933 7.05203 10.8933C7.31948 10.8933 7.57289 10.7862 7.75892 10.6002L11.5389 6.82021ZM1.83203 8C1.83203 4.6028 4.60151 1.83333 7.9987 1.83333C11.3959 1.83333 14.1654 4.6028 14.1654 8C14.1654 11.3972 11.3959 14.1667 7.9987 14.1667C4.60151 14.1667 1.83203 11.3972 1.83203 8Z" fill="#19AD7C" stroke="#19AD7C" />
              </svg>
              <h3 className='text-[#9E9996] text-sm font-medium truncate'>{t("answered")}</h3>
            </div>
          ) : (
            <div className='flex items-center gap-1'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.71875 8.88C2.71875 5.96947 5.08823 3.6 7.99875 3.6C10.9085 3.6 13.2787 5.97539 13.2787 8.88666C13.2787 11.7972 10.9093 14.1667 7.99875 14.1667C5.08898 14.1667 2.71875 11.7913 2.71875 8.88ZM7.99875 9.66667C8.54823 9.66667 8.99875 9.21614 8.99875 8.66667V5.33333C8.99875 4.78386 8.54822 4.33333 7.99875 4.33333C7.44927 4.33333 6.99875 4.78386 6.99875 5.33333V8.66667C6.99875 9.21614 7.44927 9.66667 7.99875 9.66667Z" fill="#FBB04C" stroke="#FBB04C" />
              </svg>
              <h3 className='text-[#9E9996] text-sm font-medium truncate'>{t("question_sent")}</h3>
            </div>
          )}
        </div>
      )}
      <h3 className="text-text [@media(max-width:576px)]:text-base/[21px] h-[52px] [@media(max-width:576px)]:h-[42px] line-clamp-2 font-semibold text-xl/[26px]">
        {_.titleLat}
      </h3>
      <div className='flex pt-3 border-t border-[#D9D2CE] justify-between items-center'>
        <h3 className='text-brand flex items-center gap-1 [@media(max-width:576px)]:text-xs'>ID: <span className='text-[#9E9996]'>{_.qid}</span></h3>
        <div className='flex items-center gap-3'>
          <h3 className='text-brand flex items-center gap-1'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.33398 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.666 1.33334V3.33334" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.6667 2.33334C12.8867 2.45334 14 3.30001 14 6.43334V10.5533C14 13.3 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.3 2 10.5533V6.43334C2 3.30001 3.11333 2.46001 5.33333 2.33334H10.6667Z" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.8327 11.7333H2.16602" stroke="#19AD7C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.00065 5.5C7.18065 5.5 6.48732 5.94667 6.48732 6.81333C6.48732 7.22667 6.68065 7.54 6.97398 7.74C6.56732 7.98 6.33398 8.36667 6.33398 8.82C6.33398 9.64667 6.96732 10.16 8.00065 10.16C9.02732 10.16 9.66732 9.64667 9.66732 8.82C9.66732 8.36667 9.43398 7.97333 9.02065 7.74C9.32065 7.53333 9.50732 7.22667 9.50732 6.81333C9.50732 5.94667 8.82065 5.5 8.00065 5.5ZM8.00065 7.39333C7.65398 7.39333 7.40065 7.18667 7.40065 6.86C7.40065 6.52667 7.65398 6.33333 8.00065 6.33333C8.34732 6.33333 8.60065 6.52667 8.60065 6.86C8.60065 7.18667 8.34732 7.39333 8.00065 7.39333ZM8.00065 9.33333C7.56065 9.33333 7.24065 9.11333 7.24065 8.71333C7.24065 8.31333 7.56065 8.1 8.00065 8.1C8.44065 8.1 8.76065 8.32 8.76065 8.71333C8.76065 9.11333 8.44065 9.33333 8.00065 9.33333Z" fill="#19AD7C" />
            </svg>
            <span className='text-[#9E9996] [@media(max-width:576px)]:text-xs'>{formatDate(_.created)}</span>
          </h3>
          <h3 className='text-brand flex items-center gap-1'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.3866 8.00001C10.3866 9.32001 9.31995 10.3867 7.99995 10.3867C6.67995 10.3867 5.61328 9.32001 5.61328 8.00001C5.61328 6.68001 6.67995 5.61334 7.99995 5.61334C9.31995 5.61334 10.3866 6.68001 10.3866 8.00001Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1266 14.0732 9.72665C14.6732 8.78665 14.6732 7.20665 14.0732 6.26665C12.5466 3.86665 10.3532 2.47998 7.9999 2.47998C5.64656 2.47998 3.45323 3.86665 1.92656 6.26665C1.32656 7.20665 1.32656 8.78665 1.92656 9.72665C3.45323 12.1266 5.64656 13.5133 7.9999 13.5133Z" stroke="#19AD7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className='text-[#9E9996] [@media(max-width:576px)]:text-xs'>{_.views}</span>
          </h3>
        </div>
      </div>
    </div >
  );

  useEffect(() => {
    getQuestions();
  }, []);

  if (isLoading) {
    return (
      <div className='mt-5 flex justify-center items-center min-h-[200px]'>
        <div className='loading theme !w-7 !h-7'></div>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className='mb-8 flex items-center justify-center min-h-[150px] font-semibold text-[#9E9996] select-none'>{t('empty')}</div>
    )
  }


  return (
    <ul className='grid grid-cols-2 gap-6 max-sm:grid-cols-1 max-sm:gap-3'>
      {questions.map((_, index) => (
        <li style={{
          boxShadow: "0px 2px 16px 0px #4215041C"
        }}
          key={index}
          className={`w-full relative rounded-[20px] [@media(max-width:576px)]:rounded-lg bg-background`}
        >
          {status === "sent" ? (
            <div className='w-full px-4 [@media(max-width:576px)]:px-3 py-3 flex h-full flex-col justify-between gap-3'>
              {renderContent(_, status)}
            </div>
          ) : (
            <Link href={`/answers/${_.id}`} className='w-full cursor-pointer px-4 py-3 [@media(max-width:576px)]:px-3 flex h-full flex-col justify-between gap-3'>
              {renderContent(_, status)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}


export default ProfilePage;