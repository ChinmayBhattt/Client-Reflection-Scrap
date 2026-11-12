"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitEnquiry } from "./actions";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter at least 10 digits")
    .regex(/^[0-9+\s-]+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  message: z.string().min(5, "Please enter at least 5 characters"),
  website_hp: z.string().max(0).optional(),
});

type FormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      website_hp: "",
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const formPayload = new FormData();
      formPayload.append("name", data.name);
      formPayload.append("phone", data.phone);
      if (data.email) formPayload.append("email", data.email);
      formPayload.append("message", data.message);
      if (data.website_hp) formPayload.append("website_hp", data.website_hp);

      const res = await submitEnquiry(formPayload);
      if (res.success) {
        toast.success(res.message);
        reset();
      } else {
        toast.error(res.error || "Failed to send message. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Honeypot field (hidden from real users) */}
      <input
        type="text"
        {...register("website_hp")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="space-y-1.5">
        <Label htmlFor="name">Your Full Name *</Label>
        <Input
          id="name"
          placeholder="e.g. Rahul Sharma"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone / Mobile Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. 98200 12345"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address (Optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">How can we help you? *</Label>
        <textarea
          id="message"
          rows={4}
          placeholder="Describe your scrap materials, approximate quantity, or commercial enquiry..."
          className="flex w-full rounded-lg border border-brand-border bg-brand-surface p-3.5 text-sm text-brand-dark placeholder:text-brand-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full gap-2 font-bold"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending Enquiry...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Submit Message</span>
          </>
        )}
      </Button>
    </form>
  );
}
