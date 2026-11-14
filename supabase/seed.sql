-- =====================================================================
-- Seed Data: supabase/seed.sql
-- Reflection Scrap Solutions LLP (MIDC, Andheri East, Mumbai)
-- =====================================================================
-- IMPORTANT NOTICE:
-- All 'rate_per_unit' values below are initial PLACEHOLDERS (set to 0.00).
-- Please update these rates with your current market values via the
-- Supabase Dashboard or the /admin/rates interface before going live!
-- =====================================================================

-- 1. SEED SERVICE AREAS (5 Sample Mumbai Pincodes starting with 4000xx)
INSERT INTO public.service_areas (pincode, area_name, is_active)
VALUES
  ('400093', 'MIDC, Andheri East (Primary Yard Area)', true),
  ('400059', 'Marol, Andheri East', true),
  ('400069', 'Andheri East Station & Gundavali', true),
  ('400072', 'Saki Naka, Andheri East', true),
  ('400076', 'Powai & Hiranandani', true)
ON CONFLICT (pincode) DO UPDATE SET
  area_name = EXCLUDED.area_name,
  is_active = EXCLUDED.is_active;

-- 2. SEED SCRAP CATEGORIES (10 Categories)
INSERT INTO public.scrap_categories (id, name, slug, icon, sort_order, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'Iron & Steel', 'iron-steel', 'Anvil', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'Copper', 'copper', 'Cable', 2, true),
  ('11111111-1111-1111-1111-111111111108', 'E-Waste', 'ewaste', 'CircuitBoard', 3, true),
  ('11111111-1111-1111-1111-111111111103', 'Brass', 'brass', 'Coins', 4, true),
  ('11111111-1111-1111-1111-111111111104', 'Aluminium', 'aluminium', 'Layers', 5, true),
  ('11111111-1111-1111-1111-111111111105', 'Stainless Steel', 'stainless-steel', 'Shield', 6, true),
  ('11111111-1111-1111-1111-111111111106', 'Plastic', 'plastic', 'Recycle', 7, true),
  ('11111111-1111-1111-1111-111111111107', 'Paper & Cardboard', 'paper-cardboard', 'Newspaper', 8, true),
  ('11111111-1111-1111-1111-111111111109', 'Batteries', 'batteries', 'BatteryCharging', 9, true),
  ('11111111-1111-1111-1111-111111111110', 'Appliances', 'appliances', 'Tv', 10, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- 3. SEED SCRAP ITEMS (With PLACEHOLDER rates = 0.00)
-- Category: Iron & Steel
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'Heavy Melting Steel (HMS)', 'kg', 0.00, true), -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111101', 'Cast Iron Scrap', 'kg', 0.00, true),            -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111101', 'Tin Cans & Sheet Metal', 'kg', 0.00, true);       -- PLACEHOLDER: update me

-- Category: Copper
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111102', 'Armature Copper Wire', 'kg', 0.00, true),        -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111102', 'Heavy Copper Pipes & Rods', 'kg', 0.00, true),   -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111102', 'Mixed Insulated Copper Wire', 'kg', 0.00, true); -- PLACEHOLDER: update me

-- Category: Brass
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111103', 'Honey Brass / Utensils', 'kg', 0.00, true),      -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111103', 'Brass Plumbing Fittings', 'kg', 0.00, true);     -- PLACEHOLDER: update me

-- Category: Aluminium
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111104', 'Aluminium Section / Window Extrusions', 'kg', 0.00, true), -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111104', 'Aluminium Beverage Cans', 'kg', 0.00, true),             -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111104', 'Cast Aluminium / Engine Parts', 'kg', 0.00, true);        -- PLACEHOLDER: update me

-- Category: Stainless Steel
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111105', 'SS 304 Grade Scrap', 'kg', 0.00, true),          -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111105', 'SS 316 Industrial Scrap', 'kg', 0.00, true),     -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111105', 'Mixed Stainless Kitchenware', 'kg', 0.00, true);  -- PLACEHOLDER: update me

-- Category: Plastic
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111106', 'HDPE Crates & Drums', 'kg', 0.00, true),         -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111106', 'Clear PET Plastic Bottles', 'kg', 0.00, true),   -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111106', 'Rigid Hard Plastic / PVC', 'kg', 0.00, true);    -- PLACEHOLDER: update me

-- Category: Paper & Cardboard
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111107', 'Corrugated Cardboard (Cartons)', 'kg', 0.00, true), -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111107', 'Newspaper (Raddi)', 'kg', 0.00, true),               -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111107', 'Office White Records / Notebooks', 'kg', 0.00, true); -- PLACEHOLDER: update me

-- Category: E-Waste
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111108', 'Desktop Computer CPU Tower', 'piece', 0.00, true),  -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111108', 'Laptop Computers (Dead/Obsolete)', 'piece', 0.00, true), -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111108', 'Server Racks & Motherboards', 'kg', 0.00, true);    -- PLACEHOLDER: update me

-- Category: Batteries
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111109', 'Lead-Acid Inverter Battery', 'kg', 0.00, true),   -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111109', 'Automobile Car Battery', 'piece', 0.00, true);   -- PLACEHOLDER: update me

-- Category: Appliances
INSERT INTO public.scrap_items (category_id, name, unit, rate_per_unit, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111110', 'Split Air Conditioner (1.5 Ton)', 'piece', 0.00, true), -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111110', 'Refrigerator (Single/Double Door)', 'piece', 0.00, true), -- PLACEHOLDER: update me
  ('11111111-1111-1111-1111-111111111110', 'Washing Machine', 'piece', 0.00, true);          -- PLACEHOLDER: update me
