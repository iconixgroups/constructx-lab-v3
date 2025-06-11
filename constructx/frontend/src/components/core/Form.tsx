import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const formVariants = cva(
  "space-y-6",
  {
    variants: {
      variant: {
        default: "",
        compact: "space-y-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface FormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn(formVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Form.displayName = "Form";

const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
FormField.displayName = "FormField";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, required, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-destructive ml-1">*</span>}
  </label>
));
FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-destructive", className)}
    {...props}
  >
    {children}
  </p>
));
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
};
