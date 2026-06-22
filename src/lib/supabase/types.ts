export type ProfileType = "service_provider" | "material_store";

export type PublicationStatus = "pending" | "published" | "paused" | "rejected";

export type Plan = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: ProfileType;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Location = {
  id: string;
  name: string;
  slug: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type BusinessProfile = {
  id: string;
  owner_id: string | null;
  plan_id: string | null;
  business_name: string;
  slug: string;
  profile_type: ProfileType;
  short_description: string | null;
  long_description: string | null;
  main_service: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  postal_code: string | null;
  attends_outside_cancun: boolean;
  status: PublicationStatus;
  is_featured: boolean;
  is_verified: boolean;
  accepts_card: boolean;
  accepts_transfer: boolean;
  invoices: boolean;
  emergency_service: boolean;
  service_24_7: boolean;
  by_appointment: boolean;
  attends_airbnb: boolean;
  attends_condos: boolean;
  offers_warranty: boolean;
  created_at: string;
  updated_at: string;
};

export type BusinessWithRelations = BusinessProfile & {
  plan?: Plan | null;
  categories?: Category[];
  locations?: Location[];
};

export type Database = {
  public: {
    Tables: {
      plans: {
        Row: Plan;
      };
      categories: {
        Row: Category;
      };
      locations: {
        Row: Location;
      };
      business_profiles: {
        Row: BusinessProfile;
      };
    };
  };
};
