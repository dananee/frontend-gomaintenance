import { redirect } from "next/navigation";
import { Locales } from "intlayer";

export default function RootPage() {
  redirect(`/${Locales.FRENCH}/dashboard`);
}