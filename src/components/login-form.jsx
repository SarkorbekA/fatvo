'use client'

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PocketBase from 'pocketbase';
import useAuthStore from '@/stores/auth-store';
import { useToast } from "@/hooks/use-toast"
import { useRouter, usePathname } from '@/i18n/routing';
const pb = new PocketBase("https://back.fatvo.saidoff.uz");
import { useTranslations } from "next-intl";

export function LoginForm({ onLogin, id, className, ...props }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast()

  const { setIsLoggedIn, setIsLoginOpen, setIsRegisterOpen } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLogining, setIsLogining] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Теперь используем name вместо id
    }));
  };

  const handleOAuth = async () => {
    try {
      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
        clientId: '9419799911-kvd2g3sjbbrge9e4pjsmb64gtd9gb6kn.apps.googleusercontent.com',
      });

      setIsLoggedIn(true)
      setIsLoginOpen(false)

      if (onLogin) {
        onLogin();
      }

      if (pathname === '/login') {
        router.replace('/');
      }
    } catch (error) {
      console.error('OAuth authentication failed:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogining(true)
    try {
      const authData = await pb.collection("users").authWithPassword(
        formData.email,
        formData.password
      );

      console.log("Аутентификация успешна!");

      setIsLoggedIn(true)
      setIsLoginOpen(false)

      if (onLogin) {
        onLogin();
      }


      if (pathname === '/login') {
        router.replace('/');
      }
    } catch (err) {
      toast({
        title: t("invalid_credentials"),
      })
    } finally {
      setIsLogining(false)
    }
  };

  const handleOpenRegister = () => {
    setIsRegisterOpen(true)
    setIsLoginOpen(false)
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0">
          <form className="px-5 py-6 [@media(max-width:576px)]:px-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <Label htmlFor={`login-email-${id}`}>{t('email')}</Label>
                <Input
                  id={`login-email-${id}`}
                  name="email"
                  type="email"
                  placeholder={t('input-email')}
                  required
                  value={formData.email}
                  autoComplete="email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor={`login-password-${id}`}>{t("password")}</Label>
                  {/* <a
                    href="#"
                    className="ml-auto text-[#75503E] font-semibold text-sm underline-offset-2 hover:underline"
                  >
                    {t("forgot-your-password?")}
                  </a> */}
                </div>
                <Input
                  id={`login-password-${id}`}
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder={t('input-password')}
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-[#EDE6E2]">
                <span className="relative z-10 bg-background px-2 text-[#75503E]">
                  {t("or")}
                </span>
              </div>

              <div className="flex justify-center gap-4">
                {/* <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor" />
                  </svg>
                  <span className="sr-only">Login with Apple</span>
                </Button> */}
                <button onClick={() => handleOAuth()} type="button" variant="outline" className="flex items-center justify-center rounded-lg w-10 h-10 bg-[#13060114]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.00712 12.0467C6.00712 11.3508 6.12269 10.6836 6.32897 10.0579L2.71833 7.30066C2.01463 8.72943 1.61816 10.3393 1.61816 12.0467C1.61816 13.7525 2.01415 15.3615 2.71687 16.7893L6.32556 14.0267C6.12123 13.4038 6.00712 12.7391 6.00712 12.0467Z" fill="#FBBC05" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.3471 5.71606C13.8589 5.71606 15.2243 6.25173 16.2972 7.12827L19.4182 4.01167C17.5163 2.35597 15.078 1.33334 12.3471 1.33334C8.10741 1.33334 4.4636 3.75796 2.71875 7.30066L6.32939 10.0579C7.16135 7.53246 9.53284 5.71606 12.3471 5.71606Z" fill="#EB4335" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.3471 18.3773C9.53284 18.3773 7.16134 16.5609 6.32939 14.0355L2.71875 16.7922C4.4636 20.3354 8.10741 22.76 12.3471 22.76C14.9639 22.76 17.4622 21.8309 19.3373 20.0899L15.91 17.4403C14.943 18.0495 13.7253 18.3773 12.3471 18.3773Z" fill="#34A853" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M22.5876 12.0467C22.5876 11.4136 22.49 10.7319 22.3437 10.0988H12.3467V14.238H18.1011C17.8134 15.6493 17.0302 16.7342 15.9095 17.4404L19.3368 20.09C21.3065 18.2619 22.5876 15.5387 22.5876 12.0467Z" fill="#4285F4" />
                  </svg>
                  <span className="sr-only">{t('login-with-google')}</span>
                </button>
                {/* <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor" />
                  </svg>
                  <span className="sr-only">Login with Meta</span>
                </Button> */}
              </div>
              <div className="text-center text-[#9E9996] text-[13px]">
                {t("have-no-account")}{" "}
                <button type="button" onClick={() => handleOpenRegister()} className="text-text font-semibold">
                  {t("sign-up")}
                </button>
              </div>
              <Button disabled={isLogining}
                type="submit"
                className="w-full"
              >
                {!isLogining && <div className="flex items-center gap-2.5">
                  <h3>{t('login')}</h3>
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


