export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileType = "service_provider" | "material_store";
export type CategoryType = "service" | "store";
export type CategorySection = "home_services" | "stores_materials" | "pets" | "auto_services";
export type LocationMode = "physical" | "home_service" | "both" | "zones_only";
export type PublicationStatus = "pending" | "published" | "paused" | "rejected";
export type UserRole = "admin" | "provider";

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string | null;
  updated_at: string | null;
};

export type Plan = {
  id: string;
  name: string;
  slug: string;
  price_mxn: number;
  description: string | null;
  features: Json | null;
  max_categories: number | null;
  max_photos: number | null;
  is_featured_plan: boolean | null;
  created_at: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  section: CategorySection | null;
  description: string | null;
  icon: string | null;
  created_at: string | null;
};

export type Location = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string | null;
};

export type BusinessProfile = {
  id: string;
  plan_id: string | null;
  owner_user_id: string | null;
  business_name: string;
  responsible_name: string | null;
  slug: string;
  profile_type: ProfileType;
  section: CategorySection | null;
  short_description: string | null;
  long_description: string | null;
  main_service: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  postal_code: string | null;
  has_physical_location: boolean | null;
  location_mode: LocationMode | null;
  show_map: boolean | null;
  latitude: number | null;
  longitude: number | null;
  attends_outside_cancun: boolean | null;
  status: PublicationStatus | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  accepts_card: boolean | null;
  accepts_transfer: boolean | null;
  invoices: boolean | null;
  emergency_service: boolean | null;
  service_24_7: boolean | null;
  by_appointment: boolean | null;
  service_at_home: boolean | null;
  free_estimate: boolean | null;
  attends_airbnb: boolean | null;
  attends_condos: boolean | null;
  offers_warranty: boolean | null;
  retail_sales: boolean | null;
  wholesale_sales: boolean | null;
  delivery_available: boolean | null;
  authorized_distributor: boolean | null;
  pet_veterinary_service: boolean | null;
  pet_grooming: boolean | null;
  pet_daycare: boolean | null;
  pet_food_accessories: boolean | null;
  auto_tow_service: boolean | null;
  auto_diagnostics: boolean | null;
  auto_parts: boolean | null;
  auto_wash_detailing: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type BusinessProfileInsert = {
  id?: string;
  plan_id?: string | null;
  owner_user_id?: string | null;
  business_name: string;
  responsible_name?: string | null;
  slug: string;
  profile_type: ProfileType;
  section?: CategorySection | null;
  short_description?: string | null;
  long_description?: string | null;
  main_service?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  postal_code?: string | null;
  has_physical_location?: boolean | null;
  location_mode?: LocationMode | null;
  show_map?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  attends_outside_cancun?: boolean | null;
  status?: PublicationStatus | null;
  is_featured?: boolean | null;
  is_verified?: boolean | null;
  accepts_card?: boolean | null;
  accepts_transfer?: boolean | null;
  invoices?: boolean | null;
  emergency_service?: boolean | null;
  service_24_7?: boolean | null;
  by_appointment?: boolean | null;
  service_at_home?: boolean | null;
  free_estimate?: boolean | null;
  attends_airbnb?: boolean | null;
  attends_condos?: boolean | null;
  offers_warranty?: boolean | null;
  retail_sales?: boolean | null;
  wholesale_sales?: boolean | null;
  delivery_available?: boolean | null;
  authorized_distributor?: boolean | null;
  pet_veterinary_service?: boolean | null;
  pet_grooming?: boolean | null;
  pet_daycare?: boolean | null;
  pet_food_accessories?: boolean | null;
  auto_tow_service?: boolean | null;
  auto_diagnostics?: boolean | null;
  auto_parts?: boolean | null;
  auto_wash_detailing?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type BusinessWithRelations = BusinessProfile & {
  plan?: Plan | null;
  categories?: Category[];
  locations?: Location[];
};

export type BusinessCategory = {
  business_id: string;
  category_id: string;
};

export type BusinessLocation = {
  business_id: string;
  location_id: string;
};

export type BusinessMedia = {
  id: string;
  business_id: string | null;
  url: string;
  type: string | null;
  alt: string | null;
  sort_order: number | null;
  created_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "created_at" | "updated_at"> & {
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Omit<UserProfile, "id">>;
        Relationships: [];
      };
      plans: {
        Row: Plan;
        Insert: Omit<Plan, "id" | "created_at"> & { id?: string; created_at?: string | null };
        Update: Partial<Plan>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at"> & { id?: string; created_at?: string | null };
        Update: Partial<Category>;
        Relationships: [];
      };
      locations: {
        Row: Location;
        Insert: Omit<Location, "id" | "created_at"> & { id?: string; created_at?: string | null };
        Update: Partial<Location>;
        Relationships: [];
      };
      business_profiles: {
        Row: BusinessProfile;
        Insert: BusinessProfileInsert;
        Update: Partial<BusinessProfileInsert>;
        Relationships: [
          {
            foreignKeyName: "business_profiles_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
      business_categories: {
        Row: BusinessCategory;
        Insert: BusinessCategory;
        Update: Partial<BusinessCategory>;
        Relationships: [
          {
            foreignKeyName: "business_categories_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "business_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      business_locations: {
        Row: BusinessLocation;
        Insert: BusinessLocation;
        Update: Partial<BusinessLocation>;
        Relationships: [
          {
            foreignKeyName: "business_locations_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "business_locations_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "locations";
            referencedColumns: ["id"];
          },
        ];
      };
      business_media: {
        Row: BusinessMedia;
        Insert: Omit<BusinessMedia, "id" | "created_at"> & { id?: string; created_at?: string | null };
        Update: Partial<BusinessMedia>;
        Relationships: [
          {
            foreignKeyName: "business_media_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
