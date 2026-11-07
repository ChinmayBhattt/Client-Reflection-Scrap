export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  area: string;
  landmark: string | null;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScrapCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScrapItem {
  id: string;
  category_id: string;
  name: string;
  unit: string;
  rate_per_unit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: ScrapCategory;
}

export interface RateHistory {
  id: string;
  item_id: string;
  old_rate: number;
  new_rate: number;
  changed_by: string | null;
  changed_at: string;
  item?: ScrapItem;
  changed_by_profile?: Profile;
}

export interface ServiceArea {
  id: string;
  pincode: string;
  area_name: string;
  is_active: boolean;
  created_at: string;
}

export type PickupType = "doorstep" | "dropoff";

export type PickupStatus =
  | "pending"
  | "confirmed"
  | "scheduled"
  | "picked_up"
  | "completed"
  | "cancelled";

export interface Pickup {
  id: string;
  booking_code: string;
  user_id: string;
  address_id: string | null;
  address_snapshot: Partial<Address> | null;
  pickup_type: PickupType;
  slot_date: string;
  slot_time: string;
  status: PickupStatus;
  assigned_to: string | null;
  admin_notes: string | null;
  final_amount: number | null;
  created_at: string;
  updated_at: string;
  user?: Profile;
  items?: PickupItem[];
  photos?: PickupPhoto[];
}

export interface PickupItem {
  id: string;
  pickup_id: string;
  item_id: string | null;
  approx_weight: number;
  actual_weight: number | null;
  amount: number | null;
  notes: string | null;
  created_at: string;
  item?: ScrapItem;
}

export interface PickupPhoto {
  id: string;
  pickup_id: string;
  storage_path: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
}
