"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  next: z.string().optional(),
});

const signupSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9+\s-]+$/, "Invalid phone format"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must match"),
    next: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must match"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function loginWithEmail(formData: FormData) {
  const rawData = {
    email: formData.get("email")?.toString().trim() || "",
    password: formData.get("password")?.toString() || "",
    next: formData.get("next")?.toString() || "/dashboard",
  };

  const validated = loginSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0]?.message || "Validation failed",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error: "Supabase connection is not configured yet. Please configure your .env.local file.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect(validated.data.next || "/dashboard");
}

export async function signupWithEmail(formData: FormData) {
  const rawData = {
    full_name: formData.get("full_name")?.toString().trim() || "",
    phone: formData.get("phone")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    password: formData.get("password")?.toString() || "",
    confirmPassword: formData.get("confirmPassword")?.toString() || "",
    next: formData.get("next")?.toString() || "/dashboard",
  };

  const validated = signupSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0]?.message || "Validation failed",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error: "Supabase connection is not configured yet. Please configure your .env.local file.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.full_name,
        phone: validated.data.phone,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback?next=${encodeURIComponent(
        validated.data.next || "/dashboard"
      )}`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // If email confirmation is required
  if (data.user && data.session === null) {
    return {
      success: true,
      requiresEmailVerification: true,
      message:
        "Account created! We have sent a verification email to your address. Please verify your email to log in.",
    };
  }

  revalidatePath("/", "layout");
  redirect(validated.data.next || "/dashboard");
}

export async function sendPasswordReset(formData: FormData) {
  const email = formData.get("email")?.toString().trim() || "";
  const validated = forgotPasswordSchema.safeParse({ email });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0]?.message || "Invalid email address",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error: "Supabase connection is not configured.",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    validated.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Password reset instructions have been sent to your email.",
  };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  const validated = resetPasswordSchema.safeParse({ password, confirmPassword });
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0]?.message || "Validation failed",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error: "Supabase connection is not configured.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Your password has been successfully updated. You may now log in.",
  };
}
