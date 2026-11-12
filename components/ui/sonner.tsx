"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-brand-surface group-[.toaster]:text-brand-dark group-[.toaster]:border-brand-border group-[.toaster]:shadow-elevated rounded-xl",
          description: "group-[.toast]:text-brand-muted",
          actionButton:
            "group-[.toast]:bg-brand-blue group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-brand-dark",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
