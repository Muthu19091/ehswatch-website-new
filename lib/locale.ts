import { cookies } from "next/headers";

export type Locale = "en" | "ar";

export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    return store.get("locale")?.value === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}
