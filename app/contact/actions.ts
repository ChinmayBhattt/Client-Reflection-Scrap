"use server";

import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15)
    .regex(/^[0-9+\s-]+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  message: z.string().min(5, "Message must be at least 5 characters").max(1000),
  // Honeypot field to filter spam bots
  website_hp: z.string().max(0, "Bot detected").optional(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

export async function submitEnquiry(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      message: formData.get("message")?.toString().trim() || "",
      website_hp: formData.get("website_hp")?.toString() || "",
    };

    const validated = enquirySchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Validation failed",
      };
    }

    // In phase 2, this will persist directly into `enquiries` table in Supabase.
    // For now we perform server-side validation and simulate successful acknowledgement.
    return {
      success: true,
      message: "Thank you for reaching out! Our team in MIDC Andheri East will get back to you shortly.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return {
      success: false,
      error: message,
    };
  }
}
