"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Truck, Wrench, Package, User, FileText } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type SearchCategory = "vehicle" | "work_order" | "part" | "user" | "page";

interface SearchResult {
  id: string;
  title: string;
  category: SearchCategory;
  subtitle?: string;
  url: string;
}

const categoryIcons: Record<SearchCategory, ReactNode> = {
  vehicle: <Truck className="h-4 w-4 text-blue-600" />,
  work_order: <Wrench className="h-4 w-4 text-orange-600" />,
  part: <Package className="h-4 w-4 text-green-600" />,
  user: <User className="h-4 w-4 text-purple-600" />,
  page: <FileText className="h-4 w-4 text-gray-600" />,
};

export default function SearchResultsPage() {
  const t = useTranslations("search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<SearchCategory | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryLabels: Record<SearchCategory, string> = {
    vehicle: t("tabs.vehicle"),
    work_order: t("tabs.work_order"),
    part: t("tabs.part"),
    user: t("tabs.user"),
    page: t("tabs.page"),
  };

  useEffect(() => {
    if (!query && activeTab === "all") {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (activeTab !== "all") params.set("category", activeTab);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("auth_token");

      try {
        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error("Search failed");
        
        const data = (await res.json()) as { results: SearchResult[] };
        setResults(data.results);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
          setError(t("errors.generic") || "An error occurred");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [activeTab, query, t]);

  const groupedResults = results.reduce<Record<SearchCategory, SearchResult[]>>((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [] as SearchResult[];
    acc[result.category]!.push(result);
    return acc;
  }, {} as Record<SearchCategory, SearchResult[]>);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/dashboard/search?${new URLSearchParams({ q: query }).toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
        </div>
        <Badge variant="secondary" className="w-fit">{t("quickSearch")}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("cardTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("placeholder")}
                className="pl-9"
              />
            </div>
            <Button type="submit">{t("update")}</Button>
          </form>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SearchCategory | "all")}
        className="space-y-4">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TabsTrigger key={key} value={key as SearchCategory}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-500">{t("fetching")}</span>
            </div>
          )}

          {!loading && error && (
            <div className="py-12 text-center text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              {t("empty.query", { query })}
            </div>
          )}
          
          {!loading && !error && Object.entries(groupedResults).map(([category, categoryResults]) => (
            <div key={category} className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold capitalize">
                {categoryIcons[category as SearchCategory]}
                {categoryLabels[category as SearchCategory]}
                <Badge variant="secondary" className="ml-2">{categoryResults.length}</Badge>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryResults.map((result) => (
                  <Link key={result.id} href={result.url} className="block">
                    <Card className="h-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-base text-blue-600 hover:underline">
                          {result.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {result.subtitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                          <span className="capitalize">{result.category.replace("_", " ")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {Object.keys(categoryLabels).map((category) => (
          <TabsContent key={category} value={category}>
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : groupedResults[category as SearchCategory]?.map((result) => (
                  <Link key={result.id} href={result.url} className="block">
                    <Card className="h-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-base text-blue-600 hover:underline">
                          {result.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {result.subtitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )) ?? <div className="col-span-full py-8 text-center text-gray-500">{t("empty.category")}</div>}
              </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
