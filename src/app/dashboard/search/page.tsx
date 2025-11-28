"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Truck, Wrench, Package, User, FileText } from "lucide-react";
import Link from "next/link";

type SearchCategory = "vehicle" | "work_order" | "part" | "user" | "page";

interface SearchResult {
  id: string;
  title: string;
  category: SearchCategory;
  subtitle?: string;
  url: string;
}

const categoryIcons: Record<SearchCategory, JSX.Element> = {
  vehicle: <Truck className="h-4 w-4 text-blue-600" />,
  work_order: <Wrench className="h-4 w-4 text-orange-600" />,
  part: <Package className="h-4 w-4 text-green-600" />,
  user: <User className="h-4 w-4 text-purple-600" />,
  page: <FileText className="h-4 w-4 text-gray-600" />,
};

const categoryLabels: Record<SearchCategory, string> = {
  vehicle: "Vehicles",
  work_order: "Work Orders",
  part: "Parts",
  user: "Users",
  page: "Pages",
};

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<SearchCategory | "all">("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (activeTab !== "all") params.set("category", activeTab);

    fetch(`/api/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { results: SearchResult[] }) => setResults(data.results));
  }, [activeTab, query]);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search results</h1>
          <p className="text-gray-500 dark:text-gray-400">Browse results by category with a full page view.</p>
        </div>
        <Badge variant="secondary" className="w-fit">Press / or ⌘K to search anywhere</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicles, work orders, parts, users, and pages"
                className="pl-9"
              />
            </div>
            <Button type="submit">Update results</Button>
          </form>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SearchCategory | "all")}
        className="space-y-4">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {results.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">No results found.</CardContent>
            </Card>
          ) : (
            Object.entries(groupedResults).map(([group, items]) => (
              <Card key={group}>
                <CardHeader className="flex flex-row items-center gap-2">
                  {categoryIcons[group as SearchCategory]}
                  <CardTitle>{categoryLabels[group as SearchCategory]}</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      className="flex items-center justify-between py-3 transition-colors hover:text-blue-600"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                        )}
                      </div>
                      <Badge variant="outline">{categoryLabels[result.category]}</Badge>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {Object.entries(categoryLabels).map(([value, label]) => (
          <TabsContent key={value} value={value}>
            {groupedResults[value as SearchCategory]?.length ? (
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  {categoryIcons[value as SearchCategory]}
                  <CardTitle>{label}</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
                  {groupedResults[value as SearchCategory]!.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      className="flex items-center justify-between py-3 transition-colors hover:text-blue-600"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                        )}
                      </div>
                      <Badge variant="outline">{label}</Badge>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">No {label.toLowerCase()} found.</CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
