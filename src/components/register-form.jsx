import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast";
import PocketBase from 'pocketbase';
import useAuthStore from '@/stores/auth-store';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from "next-intl";

const pb = new PocketBase("https://back.fatvo.saidoff.uz");
pb.autoCancellation(false)

export function RegisterForm({ onLogin, className, ...props }) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { setIsRegisterOpen, setIsLoggedIn, setIsLoginOpen } = useAuthStore();
  const { toast } = useToast()

  const genders = [
    { value: "male", label: t("male") },
    { value: "female", label: t("female") },
  ];

  const [regions, setRegions] = useState([])
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    region: "",
    password: "",
    passwordConfirm: "",
    gender: "male"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [isLogining, setIsLogining] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLogining(true)

    if (formData.password !== formData.passwordConfirm) {
      toast({
        duration: 6000,
        title: t("password-mismatch"),
      })

      setFormData((prevData) => ({
        ...prevData,
        password: "",
        passwordConfirm: "",
      }));

      setIsLogining(false)

      return;
    }

    if (!formData.region) {
      toast({
        duration: 6000,
        title: t("region-required"),
      });

      setIsLogining(false)

      return;
    }

    try {
      const data = {
        "password": formData.password,
        "passwordConfirm": formData.passwordConfirm,
        "email": formData.email,
        "name": formData.name,
        "gender": formData.gender,
        "region": regions.find(el => el.name === formData.region).id,
      };

      const authData = await pb.collection('users').create(data);

      const login = await pb.collection("users").authWithPassword(
        formData.email,
        formData.password,
      );

      setIsLoggedIn(true)
      setIsRegisterOpen(false)

      if (onLogin) {
        onLogin();
      }

      if (pathname === '/login') {
        router.replace('/');
      }
    } catch (err) {
      console.error("Ошибка аутентификации:", err);
    } finally {
      setIsLogining(false)
    }
  };


  const handleOpenLogin = () => {
    setIsLoginOpen(true)
    setIsRegisterOpen(false)
  }

  const getRegions = async () => {
    const records = await pb.collection('regions').getFullList({
      sort: 'created',
      fields: 'id,name'
    });

    setRegions(records);
  }

  useEffect(() => {
    getRegions()
  }, []);

  return (
    <div className={cn("flex flex-col max-h-[500px]", className)} {...props}>
      <Card className="overflow-hidden h-full">
        <CardContent className="grid p-0 h-full overflow-y-auto scrollbarY">
          <form className="px-5 py-6 [@media(max-width:576px)]:px-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <Label htmlFor="email">{t("fio")}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t("input-fullname")}
                  required
                  autoComplete="fullname"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t('input-email')}
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-1 relative z-[41]">
                <Label htmlFor="region">{t('region')}</Label>
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
                        {formData.region
                          ? regions.find((el) => el.name === formData.region)?.name
                          : <h3 className='text-[#9E9996]'> {t("select-city")}</h3>}
                      </div>
                      <ChevronsUpDown className="w-5 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[334px] max-sm:w-[250px] p-0 relative z-[100]">
                    <Command>
                      <CommandInput placeholder={t("search-city")} className="h-9" />
                      <CommandList className="scrollbarY">
                        <CommandEmpty>{t("city-not-found")}</CommandEmpty>
                        <CommandGroup>
                          {regions.map((el) => (
                            <CommandItem
                              key={el.id}
                              className={`${formData.region === el.name ? "cursor-default select-none" : "cursor-pointer"} `}
                              value={el.name}
                              onSelect={(currentValue) => {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  ["region"]: currentValue,
                                }));
                                formData.region === el.name ? null : setOpen(false)
                              }}
                            >
                              {el.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  formData.region === el.name ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid gap-1 relative z-[40]">
                <Label>{t("gender")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {genders.map((gender) => (
                    <label
                      key={gender.value}
                      style={{
                        "boxShadow": "0px 2px 16px 0px #4215041C"
                      }}
                      className={`flex items-center justify-between gap-2 text-[#9E9996] px-4 py-3 rounded-lg border-[2px] ${formData.gender === gender.value
                        ? "border-brand"
                        : "border-background"
                        } cursor-pointer`}
                    >
                      <input
                        type="radio"
                        id={`gender-${gender.value}`}
                        name="gender"
                        value={gender.value}
                        checked={formData.gender === gender.value}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      {gender.label}
                      <div
                        className={`w-5 h-5 flex items-center justify-center border rounded-full ${formData.gender === gender.value
                          ? "border-brand border-[4px]"
                          : "border-text"
                          }`}
                      >
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    minLength={8}
                    placeholder={t("input-password")}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute w-5 h-5 top-1/2 -translate-y-1/2 right-4"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-full h-full" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg
                        className="w-full h-full"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12.1083 7.89172L7.8916 12.1084C7.34994 11.5667 7.0166 10.8251 7.0166 10.0001C7.0166 8.35006 8.34993 7.01672 9.99993 7.01672C10.8249 7.01672 11.5666 7.35006 12.1083 7.89172Z" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.8499 4.80828C13.3915 3.70828 11.7249 3.10828 9.99987 3.10828C7.0582 3.10828 4.31654 4.84161 2.4082 7.84161C1.6582 9.01661 1.6582 10.9916 2.4082 12.1666C3.06654 13.1999 3.8332 14.0916 4.66654 14.8083" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.0166 16.2749C7.9666 16.6749 8.97493 16.8916 9.99993 16.8916C12.9416 16.8916 15.6833 15.1583 17.5916 12.1583C18.3416 10.9833 18.3416 9.00828 17.5916 7.83328C17.3166 7.39994 17.0166 6.99161 16.7083 6.60828" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.9252 10.5834C12.7085 11.7584 11.7502 12.7167 10.5752 12.9334" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.89199 12.1083L1.66699 18.3333" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.3334 1.66663L12.1084 7.89163" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="passwordConfirm">{t("confirm_password")}</Label>
                <div className="relative">
                  <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    autoComplete="passwordConfirm"
                    required
                    placeholder={t('reenter_password')}
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute w-5 h-5 top-1/2 -translate-y-1/2 right-4"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  >
                    {showPasswordConfirm ? (
                      <svg className="w-full h-full" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg
                        className="w-full h-full"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12.1083 7.89172L7.8916 12.1084C7.34994 11.5667 7.0166 10.8251 7.0166 10.0001C7.0166 8.35006 8.34993 7.01672 9.99993 7.01672C10.8249 7.01672 11.5666 7.35006 12.1083 7.89172Z" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.8499 4.80828C13.3915 3.70828 11.7249 3.10828 9.99987 3.10828C7.0582 3.10828 4.31654 4.84161 2.4082 7.84161C1.6582 9.01661 1.6582 10.9916 2.4082 12.1666C3.06654 13.1999 3.8332 14.0916 4.66654 14.8083" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.0166 16.2749C7.9666 16.6749 8.97493 16.8916 9.99993 16.8916C12.9416 16.8916 15.6833 15.1583 17.5916 12.1583C18.3416 10.9833 18.3416 9.00828 17.5916 7.83328C17.3166 7.39994 17.0166 6.99161 16.7083 6.60828" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.9252 10.5834C12.7085 11.7584 11.7502 12.7167 10.5752 12.9334" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.89199 12.1083L1.66699 18.3333" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.3334 1.66663L12.1084 7.89163" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="text-center text-[#9E9996] text-[13px]">
                {t("have-no-account")}{" "}
                <button type="button" onClick={() => handleOpenLogin()} className="text-text font-semibold">
                  {t("login")}
                </button>
              </div>
              <Button disabled={isLogining}
                type="submit"
                className="w-full"
              >
                {!isLogining && <div className="flex items-center gap-2.5">
                  <h3>{t("sign-up")}</h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.90039 7.56C9.21039 3.96 11.0604 2.49 15.1104 2.49H15.2404C19.7104 2.49 21.5004 4.28 21.5004 8.75V15.27C21.5004 19.74 19.7104 21.53 15.2404 21.53H15.1104C11.0904 21.53 9.24039 20.08 8.91039 16.54" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12H14.88" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.6504 8.65L16.0004 12L12.6504 15.35" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>}
                {isLogining && <div className="loading !w-6 !h-6"></div>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


