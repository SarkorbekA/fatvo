'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import PocketBase from 'pocketbase';
import { useToast } from "@/hooks/use-toast"
const pb = new PocketBase("https://back.fatvo.saidoff.uz");

function AskForm() {
  const t = useTranslations('AskForm')
  const { toast } = useToast()
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [file, setFile] = useState(null);

  const [open, setOpen] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    question: '',
  });

  const handleCheckboxChange = () => {
    setIsPrivate(prev => !prev);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue = value.replace(/[\uD800-\uDFFF]./g, "");

    if (type === "textarea") {
      newValue = newValue.slice(0, 2000);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };


  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsTouched(true);

    if (formData.question.length < 40) {
      setError(t("question_too_short"));
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        title: formData.title,
        category: categories.find((el) => el.name === formData.category)?.id || null,
        question: formData.question,
        scope: isPrivate ? "private" : "public",
        user: pb.authStore.record.id,
        file: file,
      };

      await pb.collection("question_answers").create(data);

      toast({
        duration: 3000,
        title: t("submit-success"),
      });

      setFormData({
        title: "",
        category: "",
        question: "",
        scope: "public",
      });

      setFile(null);
      setIsPrivate(false);

      setIsTouched(false);
      setError("");

    } catch (err) {
      console.error("Error creating question:", err);
      toast({
        duration: 3000,
        title: t("submit-error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    const records = await pb.collection('question_categories').getFullList({
      sort: 'created',
      fields: 'id,name'
    });

    setCategories(records);
  }

  useEffect(() => {
    getCategories()
  }, []);

  return (
    <section className="mt-2 mb-10 px-2 [@media(max-width:576px)]:px-0 bg-right bg-contain bg-no-repeat" style={{ backgroundImage: "url('/ask-bg.png')" }}>
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList className="h-9">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('main')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("ask-question")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className='mt-8 mx-auto bg-background max-w-[580px] max-sm:rounded-lg rounded-2xl'>
          <div className='py-3.5 px-4 border-b border-b-[#EDE6E2]'>
            <h3 className='text-base/[21px] text-text font-semibold'>{t("ask-question")}</h3>
          </div>
          <form onSubmit={handleSubmit} className="py-6 px-5 flex flex-col gap-4">
            <Label htmlFor="title">
              <h3 className="mb-1">{t("question-title")}</h3>
              <Input
                required
                id="title"
                name="title"
                type="text"
                className="placeholder:font-normal"
                placeholder={t("question-title")}
                value={formData.title}
                onChange={handleChange}
              />
            </Label>

            <Label htmlFor="category">
              <h3 className="mb-1">{t("question-category")}</h3>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <button style={{
                    boxShadow: "0px 2px 16px 0px #4215041C"
                  }}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex md:text-sm/[16px] max-sm:text-sm w-full rounded-lg bg-background px-4 max-sm:px-3 py-3 text-base/[16px] items-center justify-between"
                  >
                    <div className='[@media(max-width:280px)]:w-[calc(100%-22px)] text-left ... truncate'>
                      {formData.category
                        ? categories.find((el) => el.name === formData.category)?.name
                        : <h3 className='text-[#9E9996]'> {t("select-category")}</h3>}
                    </div>
                    <ChevronsUpDown className="w-5 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[500px] max-sm:w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder={t("search_category")} className="h-9" />
                    <CommandList className="scrollbarY">
                      <CommandEmpty>{t("no_category_found")}</CommandEmpty>
                      <CommandGroup>
                        {categories.map((el) => (
                          <CommandItem
                            className="cursor-pointer"
                            key={el.id}
                            value={el.name}
                            onSelect={(currentValue) => {
                              setFormData((prevData) => ({
                                ...prevData,
                                ["category"]: currentValue,
                              }));
                              setOpen(false)
                            }}
                          >
                            {el.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                formData.category === el.name ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DropdownMenuContent>
              </DropdownMenu>
            </Label>

            <div>
              <Label htmlFor="question" className="relative">
                <h3 className="mb-1">{t("question")}</h3>
                <Textarea
                  id="question"
                  name="question"
                  required
                  className={`max-md:h-[150px] ${isTouched && formData.question.length < 40 ? "border-[#E82113]" : ""}`}
                  placeholder={t("question-text")}
                  value={formData.question}
                  onChange={handleChange}
                />
                <div className="absolute bottom-1.5 right-1.5 text-[#9E9996] text-xs">
                  {formData.question.length}/2000
                </div>
              </Label>
              <div className='min-h-[18px] mt-1'>
                {isTouched && formData.question.length < 40 && (
                  <p className="text-[#E82113] font-normal leading-[18px] text-sm">
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-1">{t("file")}</h3>
              <div className="relative">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*,video/*,audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex items-center border rounded-md px-3 py-3">
                  <span className="flex-1 font-medium truncate">{file ? file.name : t("upload_file_placeholder")}</span>
                </div>
                {!file && <Label
                  htmlFor="file"
                  className="h-10 absolute right-1 top-1/2 -translate-y-1/2 py-2 px-3 text-sm flex items-center bg-[#D9D2CE] rounded-md font-normal cursor-pointer"
                >
                  {t("choose_file")}
                </Label>}
                {file && (
                  <button
                    type="button"
                    className="absolute z-[10] right-1 top-1/2 -translate-y-1/2 w-11 h-10 bg-[#D9D2CE] rounded-md flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.0013 18.3333C14.5846 18.3333 18.3346 14.5833 18.3346 9.99996C18.3346 5.41663 14.5846 1.66663 10.0013 1.66663C5.41797 1.66663 1.66797 5.41663 1.66797 9.99996C1.66797 14.5833 5.41797 18.3333 10.0013 18.3333Z"
                        stroke="#130601"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.64062 12.3584L12.3573 7.64172"
                        stroke="#130601"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.3573 12.3584L7.64062 7.64172"
                        stroke="#130601"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <h3 className="mt-1 font-normal leading-[18px] text-sm text-text">
                {t("file_upload_info")}
              </h3>
            </div>

            <Label htmlFor="terms" className="flex items-center justify-between mt-1 cursor-pointer">
              <h3 className='leading-[21px] font-medium text-text'>
                {t("privacy_question")}
              </h3>
              <Checkbox checked={isPrivate} onCheckedChange={handleCheckboxChange} id="terms" />
            </Label>

            <div className='w-full'>
              <Button className="w-full py-3 rounded-md">
                {!isLoading ? (
                  <React.Fragment>
                    <h3 className='text-xl/[20px]'>{t("submit")}</h3>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.7992 3.43434L16.7987 3.4345L7.76968 6.43419C7.76954 6.43423 7.76941 6.43428 7.76928 6.43432C6.28397 6.93109 5.20907 7.49409 4.51533 8.06769C3.81982 8.64274 3.55859 9.18201 3.55859 9.64375C3.55859 10.1054 3.81967 10.6439 4.51495 11.2176C5.20855 11.79 6.28335 12.3512 7.76868 12.8455L16.7992 3.43434ZM16.7992 3.43434C18.7472 2.78501 20.0711 3.0499 20.7635 3.74331C21.4565 4.43722 21.721 5.7642 21.0767 7.71218C21.0766 7.71243 21.0765 7.71269 21.0764 7.71294L18.0668 16.7317L18.0667 16.7321M16.7992 3.43434L18.0667 16.7321M18.0667 16.7321C17.5724 18.2175 17.0106 19.2923 16.4375 19.9859M18.0667 16.7321L16.4375 19.9859M16.4375 19.9859C15.8631 20.6811 15.3236 20.9425 14.8611 20.9425M16.4375 19.9859L14.8611 20.9425M14.8611 20.9425C14.3986 20.9425 13.8591 20.6811 13.2847 19.9859M14.8611 20.9425L13.2847 19.9859M13.2847 19.9859C12.7117 19.2923 12.1499 18.2176 11.6556 16.7324L13.2847 19.9859ZM10.4487 13.7355L7.76897 12.8456L11.6555 16.7321L10.7656 14.0524L10.6866 13.8145L10.4487 13.7355ZM13.5146 12.5136L13.5156 12.5126L17.3146 8.69355C17.3148 8.69341 17.3149 8.69327 17.3151 8.69313C17.7999 8.20783 17.7998 7.41157 17.3146 6.92645C16.8294 6.44119 16.0328 6.44119 15.5475 6.92645L15.5466 6.92738L11.7475 10.7464C11.7475 10.7465 11.7474 10.7466 11.7473 10.7467C11.2623 11.2319 11.2623 12.0284 11.7475 12.5136C11.9962 12.7623 12.3156 12.88 12.6311 12.88C12.9465 12.88 13.2659 12.7623 13.5146 12.5136Z" fill="white" stroke="white" />
                    </svg>
                  </React.Fragment>
                ) : (
                  <div className='loading !w-6 !h-6'></div>
                )}
              </Button>
            </div>
          </form>
        </div>
        <div className='mt-6'>
          <h3 className='text-brand font-semibold leading-[21px]'>{t("rule_title")}</h3>
          <div className='mt-3'>
            {[...Array(7)].map((_, index) => (
              <p key={index} className='mb-1 text-xs'>{index + 1}. {t(`rules.${index + 1}`)}</p>
            ))}
          </div>
          <ul className='mt-1'>
            {[...Array(5)].map((_, index) => (
              <li key={index} className='mb-1 text-xs list-disc list-inside'> {t(`subrules.${index + 1}`)}</li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
}

export default AskForm;
