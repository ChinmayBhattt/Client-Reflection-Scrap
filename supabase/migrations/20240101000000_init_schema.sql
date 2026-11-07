-- =====================================================================
-- Migration: 20240101000000_init_schema.sql
-- Project: Reflection Scrap Solutions LLP (LLPIN ACY-4261)
-- Description: Complete schema, RLS policies, triggers, and storage setup
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper: Security Definer function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home', -- e.g. Home, Office, Factory, Warehouse
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line1 TEXT NOT NULL,
  area TEXT NOT NULL,
  landmark TEXT,
  pincode TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_pincode ON public.addresses(pincode);

-- 3. SCRAP CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.scrap_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_scrap_categories_slug ON public.scrap_categories(slug);
CREATE INDEX IF NOT EXISTS idx_scrap_categories_active ON public.scrap_categories(is_active);

-- 4. SCRAP ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.scrap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.scrap_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg', -- kg, piece, ton
  rate_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_scrap_items_category_id ON public.scrap_items(category_id);
CREATE INDEX IF NOT EXISTS idx_scrap_items_active ON public.scrap_items(is_active);

-- 5. RATE HISTORY TABLE (audit log for price changes)
CREATE TABLE IF NOT EXISTS public.rate_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.scrap_items(id) ON DELETE CASCADE,
  old_rate NUMERIC(10, 2) NOT NULL,
  new_rate NUMERIC(10, 2) NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rate_history_item_id ON public.rate_history(item_id);

-- 6. SERVICE AREAS TABLE (serviceable Mumbai pincodes)
CREATE TABLE IF NOT EXISTS public.service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pincode TEXT NOT NULL UNIQUE,
  area_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_service_areas_pincode ON public.service_areas(pincode);

-- 7. PICKUPS TABLE
CREATE TABLE IF NOT EXISTS public.pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE, -- e.g. RSS-000123
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  address_snapshot JSONB, -- stores immutable address at the time of booking
  pickup_type TEXT NOT NULL DEFAULT 'doorstep' CHECK (pickup_type IN ('doorstep', 'dropoff')),
  slot_date DATE NOT NULL,
  slot_time TEXT NOT NULL, -- e.g. '8:00 AM - 12:00 PM'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'scheduled', 'picked_up', 'completed', 'cancelled')),
  assigned_to TEXT, -- staff member name
  admin_notes TEXT,
  final_amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pickups_user_id ON public.pickups(user_id);
CREATE INDEX IF NOT EXISTS idx_pickups_status ON public.pickups(status);
CREATE INDEX IF NOT EXISTS idx_pickups_booking_code ON public.pickups(booking_code);
CREATE INDEX IF NOT EXISTS idx_pickups_slot_date ON public.pickups(slot_date);

-- 8. PICKUP ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.pickup_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_id UUID NOT NULL REFERENCES public.pickups(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.scrap_items(id) ON DELETE SET NULL,
  approx_weight NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  actual_weight NUMERIC(10, 2),
  amount NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pickup_items_pickup_id ON public.pickup_items(pickup_id);

-- 9. PICKUP PHOTOS TABLE
CREATE TABLE IF NOT EXISTS public.pickup_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_id UUID NOT NULL REFERENCES public.pickups(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pickup_photos_pickup_id ON public.pickup_photos(pickup_id);

-- 10. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_replied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_enquiries_is_read ON public.enquiries(is_read);

-- =====================================================================
-- DATABASE TRIGGERS & FUNCTIONS
-- =====================================================================

-- Trigger: Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_scrap_categories_updated_at
  BEFORE UPDATE ON public.scrap_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_scrap_items_updated_at
  BEFORE UPDATE ON public.scrap_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_pickups_updated_at
  BEFORE UPDATE ON public.pickups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Automatically provision public.profiles on new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer' -- Always default to customer
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Prevent non-admin users from escalating their own role
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role <> OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'You are not authorized to modify user roles.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Trigger: Log rate changes to rate_history
CREATE OR REPLACE FUNCTION public.log_rate_history()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rate_per_unit <> OLD.rate_per_unit THEN
    INSERT INTO public.rate_history (item_id, old_rate, new_rate, changed_by)
    VALUES (NEW.id, OLD.rate_per_unit, NEW.rate_per_unit, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_scrap_item_rate_changed
  AFTER UPDATE ON public.scrap_items
  FOR EACH ROW EXECUTE FUNCTION public.log_rate_history();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrap_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES RLS
-- Customer can read own profile; Admin can read all
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Customer can update own profile (trigger ensures role cannot be changed); Admin can update any
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- 2. ADDRESSES RLS
CREATE POLICY "Users can manage own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 3. SCRAP CATEGORIES RLS
CREATE POLICY "Public can view active scrap categories"
  ON public.scrap_categories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can manage scrap categories"
  ON public.scrap_categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. SCRAP ITEMS RLS
CREATE POLICY "Public can view active scrap items"
  ON public.scrap_items FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can manage scrap items"
  ON public.scrap_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. RATE HISTORY RLS
CREATE POLICY "Admin can view and manage rate history"
  ON public.rate_history FOR ALL
  USING (public.is_admin());

-- 6. SERVICE AREAS RLS
CREATE POLICY "Public can view active service areas"
  ON public.service_areas FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can manage service areas"
  ON public.service_areas FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. PICKUPS RLS
CREATE POLICY "Users can view own pickups"
  ON public.pickups FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create own pickups"
  ON public.pickups FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update own pickups before completion"
  ON public.pickups FOR UPDATE
  USING (
    (auth.uid() = user_id AND status IN ('pending', 'confirmed'))
    OR public.is_admin()
  );

CREATE POLICY "Admin can delete pickups"
  ON public.pickups FOR DELETE
  USING (public.is_admin());

-- 8. PICKUP ITEMS RLS
CREATE POLICY "Users can view own pickup items"
  ON public.pickup_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pickups
      WHERE pickups.id = pickup_items.pickup_id
      AND (pickups.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Users can insert pickup items for own bookings"
  ON public.pickup_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pickups
      WHERE pickups.id = pickup_items.pickup_id
      AND (pickups.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Admin can manage pickup items"
  ON public.pickup_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. PICKUP PHOTOS RLS
CREATE POLICY "Users can view own pickup photos"
  ON public.pickup_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pickups
      WHERE pickups.id = pickup_photos.pickup_id
      AND (pickups.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Users can insert photos for own pickups"
  ON public.pickup_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pickups
      WHERE pickups.id = pickup_photos.pickup_id
      AND (pickups.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 10. ENQUIRIES RLS
-- Anyone can submit an enquiry
CREATE POLICY "Public can insert enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

-- Only admin can view and update enquiries
CREATE POLICY "Admin can view and update enquiries"
  ON public.enquiries FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- SUPABASE STORAGE BUCKET: pickup-photos
-- =====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pickup-photos',
  'pickup-photos',
  false, -- private bucket
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

-- Storage RLS: Owner can upload to their own folder (folder name is user id)
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pickup-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: Owner can read own photos; Admin can read all
CREATE POLICY "Users can view own photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'pickup-photos'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );

-- Storage RLS: Owner can delete own photos; Admin can delete all
CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pickup-photos'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );
