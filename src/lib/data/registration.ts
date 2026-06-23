import { categories as demoCategories, locations as demoLocations, plans as demoPlans } from "@/lib/demo-data";
import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabase/server";
import type { CategoryType } from "@/lib/supabase/types";

export type RegistrationPlan = {
  id: string;
  name: string;
  slug: string;
  priceMxn: number;
};

export type RegistrationCategory = {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
};

export type RegistrationLocation = {
  id: string;
  name: string;
  slug: string;
};

export type RegistrationOptions = {
  plans: RegistrationPlan[];
  categories: RegistrationCategory[];
  locations: RegistrationLocation[];
  supabaseConfigured: boolean;
  source: "supabase" | "demo";
};

function demoOptions(): RegistrationOptions {
  return {
    plans: demoPlans.map((plan) => ({
      id: plan.slug,
      name: plan.name,
      slug: plan.slug,
      priceMxn: plan.price,
    })),
    categories: demoCategories.map((category) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      type: category.type === "service_provider" ? "service" : "store",
    })),
    locations: demoLocations.map((location) => ({
      id: location.slug,
      name: location.name,
      slug: location.slug,
    })),
    supabaseConfigured: hasSupabaseServerConfig(),
    source: "demo",
  };
}

async function withTimeout<T>(promise: PromiseLike<T>, milliseconds = 4000) {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), milliseconds);
    }),
  ]);
}

export async function getRegistrationOptions(): Promise<RegistrationOptions> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return demoOptions();
  }

  const results = await withTimeout(
    Promise.all([
      supabase.from("plans").select("id,name,slug,price_mxn").order("price_mxn", { ascending: true }),
      supabase.from("categories").select("id,name,slug,type").order("name", { ascending: true }),
      supabase.from("locations").select("id,name,slug").order("name", { ascending: true }),
    ]),
  );

  if (!results) {
    return demoOptions();
  }

  const [plansResult, categoriesResult, locationsResult] = results;

  if (plansResult.error || categoriesResult.error || locationsResult.error) {
    return demoOptions();
  }

  return {
    plans: plansResult.data.map((plan) => ({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      priceMxn: plan.price_mxn,
    })),
    categories: categoriesResult.data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      type: category.type,
    })),
    locations: locationsResult.data.map((location) => ({
      id: location.id,
      name: location.name,
      slug: location.slug,
    })),
    supabaseConfigured: true,
    source: "supabase",
  };
}
