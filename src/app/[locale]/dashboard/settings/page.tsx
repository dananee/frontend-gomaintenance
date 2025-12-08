import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: {
    locale: string;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = params;
  redirect(`/${locale}/dashboard/settings/profile`);
}