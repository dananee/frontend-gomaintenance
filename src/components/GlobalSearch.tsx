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
import { Search, Truck, Wrench, Package, FileText } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "vehicle" | "work-order" | "part" | "page";
  subtitle?: string;
  url: string;
}

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  // Mock search results - replace with API call
  const allResults: SearchResult[] = [
    // Vehicles
    { id: "v1", title: "2020 Ford F-150", type: "vehicle", subtitle: "ABC-123", url: "/dashboard/vehicles/v1" },
    { id: "v2", title: "2019 Honda Civic", type: "vehicle", subtitle: "XYZ-789", url: "/dashboard/vehicles/v2" },
    { id: "v3", title: "2021 Toyota Camry", type: "vehicle", subtitle: "DEF-456", url: "/dashboard/vehicles/v3" },
    
    // Work Orders
    { id: "wo1", title: "Brake pads replacement", type: "work-order", subtitle: "WO-124", url: "/dashboard/work-orders/wo1" },
    { id: "wo2", title: "Oil change service", type: "work-order", subtitle: "WO-125", url: "/dashboard/work-orders/wo2" },
    { id: "wo3", title: "Transmission service", type: "work-order", subtitle: "WO-087", url: "/dashboard/work-orders/wo3" },
    
    // Parts
    { id: "p1", title: "Brake Pads (Ceramic)", type: "part", subtitle: "BRK-PAD-001", url: "/dashboard/inventory/p1" },
    { id: "p2", title: "Oil Filter", type: "part", subtitle: "OIL-FLT-002", url: "/dashboard/inventory/p2" },
    { id: "p3", title: "Air Filter", type: "part", subtitle: "AIR-FLT-003", url: "/dashboard/inventory/p3" },
    
    // Pages
    { id: "page1", title: "Dashboard", type: "page", url: "/dashboard" },
    { id: "page2", title: "Vehicles", type: "page", url: "/dashboard/vehicles" },
    { id: "page3", title: "Work Orders", type: "page", url: "/dashboard/work-orders" },
    { id: "page4", title: "Inventory", type: "page", url: "/dashboard/inventory" },
  ];

  const filteredResults = query
    ? allResults.filter((result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : allResults;

  const vehicleResults = filteredResults.filter((r) => r.type === "vehicle");
  const workOrderResults = filteredResults.filter((r) => r.type === "work-order");
  const partResults = filteredResults.filter((r) => r.type === "part");
  const pageResults = filteredResults.filter((r) => r.type === "page");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "vehicle":
        return <Truck className="mr-2 h-4 w-4 text-blue-600" />;
      case "work-order":
        return <Wrench className="mr-2 h-4 w-4 text-orange-600" />;
      case "part":
        return <Package className="mr-2 h-4 w-4 text-green-600" />;
      case "page":
        return <FileText className="mr-2 h-4 w-4 text-gray-600" />;
      default:
        return <Search className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto hidden rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600 sm:inline-block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search vehicles, work orders, parts..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {pageResults.length > 0 && (
            <CommandGroup heading="Pages">
              {pageResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.url)}
                >
                  {getIcon(result.type)}
                  <span>{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {vehicleResults.length > 0 && (
            <CommandGroup heading="Vehicles">
              {vehicleResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.url)}
                >
                  {getIcon(result.type)}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-gray-500">{result.subtitle}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {workOrderResults.length > 0 && (
            <CommandGroup heading="Work Orders">
              {workOrderResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.url)}
                >
                  {getIcon(result.type)}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-gray-500">{result.subtitle}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {partResults.length > 0 && (
            <CommandGroup heading="Inventory Parts">
              {partResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.url)}
                >
                  {getIcon(result.type)}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-gray-500">{result.subtitle}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
