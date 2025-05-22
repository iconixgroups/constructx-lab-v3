import * as React from "react"

import { cn } from "../../lib/utils"

const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    variant?: "default" | "lead" | "large" | "small" | "muted"
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-base text-foreground",
        {
          "text-xl md:text-2xl": variant === "lead",
          "text-lg": variant === "large",
          "text-sm": variant === "small",
          "text-sm text-muted-foreground": variant === "muted",
        },
        className
      )}
      {...props}
    />
  )
})
Text.displayName = "Text"

export { Text }
