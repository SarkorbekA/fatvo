import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex w-full rounded-lg bg-background px-4 max-sm:py-2.5 max-sm:text-sm py-4 text-base/[16px] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#9E9996] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm/[16px]",
        className
      )}
      style={{
        boxShadow: "0px 2px 16px 0px #4215041C"
      }}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
