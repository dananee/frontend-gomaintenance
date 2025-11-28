"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Loader2,
  Package,
  Search,
  Truck,
  User,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SearchCategory = "vehicle" | "work_order" | "part" | "user" | "page";

interface SearchResult {
  id: string;
  title: string;
  category: SearchCategory;
  subtitle?: string;
  url: string;
}

interface GlobalSearchProps {
  className?: string;
}

const categoryLabels: Record<SearchCategory, string> = {
  vehicle: "Vehicles",
  work_order: "Work Orders",
  part: "Parts",
  user: "Users",
  page: "Pages",
};

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [focused, setFocused] = React.useState(false);
  const [category, setCategory] = React.useState<SearchCategory | "all">("all");
  const router = useRouter();

  const fetchResults = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (category !== "all") params.set("category", category);

    const response = await fetch(`/api/search?${params.toString()}`);
    const data = (await response.json()) as { results: SearchResult[] };
    setResults(data.results);
    setLoading(false);
  }, [category, query]);

  React.useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }

      if (e.key === "/") {
        e.preventDefault();
        setFocused(true);
        setDropdownOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setPaletteOpen(false);
    setDropdownOpen(false);
    setFocused(false);
    setQuery("");
    router.push(url);
  };

  const handleViewAll = () => {
    setDropdownOpen(false);
    router.push(`/dashboard/search?${new URLSearchParams({ q: query }).toString()}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "vehicle":
        return <Truck className="mr-2 h-4 w-4 text-blue-600" />;
      case "work_order":
        return <Wrench className="mr-2 h-4 w-4 text-orange-600" />;
      case "part":
        return <Package className="mr-2 h-4 w-4 text-green-600" />;
      case "user":
        return <User className="mr-2 h-4 w-4 text-purple-600" />;
      case "page":
        return <FileText className="mr-2 h-4 w-4 text-gray-600" />;
      default:
        return <Search className="mr-2 h-4 w-4" />;
    }
  };

  const groupedResults = results.reduce<Record<SearchCategory, SearchResult[]>>((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [] as SearchResult[];
    }
    acc[result.category]!.push(result);
    return acc;
  }, {} as Record<SearchCategory, SearchResult[]>);

  const showDropdown = dropdownOpen && (loading || results.length > 0);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:border-blue-500 focus-within:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
          focused && "ring-2 ring-blue-100 dark:ring-blue-900/40"
        )}
      >
        <Search className="h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setFocused(true);
            setDropdownOpen(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setDropdownOpen(false), 100);
          }}
          placeholder="Search vehicles, work orders, parts, users..."
          className="h-auto border-none bg-transparent px-0 text-sm focus-visible:ring-0"
        />
        <kbd className="ml-auto hidden rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600 sm:inline-block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          /
        </kbd>
      </div>

      {showDropdown && (
        <div className="absolute z-30 mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
              className="cursor-pointer"
            >
              All
            </Badge>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <Badge
                key={value}
                variant={category === value ? "default" : "outline"}
                onClick={() => setCategory(value as SearchCategory)}
                className="cursor-pointer"
              >
                {label}
              </Badge>
            ))}
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
              <span>Press ⌘K for command palette</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Fetching results...
            </div>
          ) : results.length === 0 ? (
            <p className="py-4 text-sm text-gray-500">No results found.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedResults).map(([group, groupResults]) => (
                <div key={group} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    {categoryLabels[group as SearchCategory]}
                  </div>
                  <div className="divide-y divide-gray-100 rounded-md border border-gray-100 dark:divide-gray-800 dark:border-gray-800">
                    {groupResults.slice(0, 3).map((result) => (
                      <button
                        key={result.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(result.url)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {getIcon(result.category)}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.title}</span>
                          {result.subtitle && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">{result.subtitle}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setPaletteOpen(true)}>
              Open command palette
            </Button>
            <Button variant="link" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={handleViewAll}>
              View all results
            </Button>
          </div>
        </div>
      )}

      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput
          placeholder="Search vehicles, work orders, parts..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {Object.entries(groupedResults).map(([group, groupResults]) => (
            <CommandGroup key={group} heading={categoryLabels[group as SearchCategory]}>
              {groupResults.map((result) => (
                <CommandItem key={result.id} onSelect={() => handleSelect(result.url)}>
                  {getIcon(result.category)}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-gray-500">{result.subtitle}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
