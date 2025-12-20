import { NextResponse } from "next/server";

type SearchCategory = "vehicle" | "work_order" | "part" | "user" | "page";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  category: SearchCategory;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const staticPages: SearchResult[] = [
  { id: "page-dashboard", title: "Dashboard", category: "page", url: "/dashboard" },
  { id: "page-maintenance", title: "Maintenance", category: "page", url: "/dashboard/maintenance" },
  { id: "page-notifications", title: "Notifications", category: "page", url: "/dashboard/notifications" },
  { id: "page-vehicles", title: "Vehicles", category: "page", url: "/dashboard/vehicles" },
  { id: "page-inventory", title: "Inventory", category: "page", url: "/dashboard/inventory" },
  { id: "page-work-orders", title: "Work Orders", category: "page", url: "/dashboard/work-orders" },
  { id: "page-users", title: "Users", category: "page", url: "/dashboard/users" },
  { id: "page-settings", title: "Settings", category: "page", url: "/dashboard/settings" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";
  const category = searchParams.get("category") as SearchCategory | null;
  const authHeader = request.headers.get("Authorization");

  console.log(`[SearchAPI] Query: "${query}", Category: "${category}"`);

  if (!query && !category) {
    return NextResponse.json({ results: [] });
  }

  const results: SearchResult[] = [];

  // 1. Fetch from unified Go backend endpoint
  try {
    const url = new URL(`${API_BASE_URL}/search`);
    if (query) url.searchParams.set("q", query);

    const res = await fetch(url.toString(), {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      
      // Map backend response types to SearchResult
      if (data.vehicles) {
        results.push(...data.vehicles);
      }
      if (data.workOrders) {
        results.push(...data.workOrders);
      }
      if (data.parts) {
        results.push(...data.parts);
      }
      if (data.users) {
        results.push(...data.users);
      }
    } else {
      console.error(`Backend search error: ${res.status}`);
    }
  } catch (e) {
    console.error("Error fetching from Go search endpoint:", e);
  }

  // 2. Add static pages matching the query
  if (!category || category === "page") {
    const lowerQuery = query.toLowerCase();
    const filteredPages = query
      ? staticPages.filter((p) => p.title.toLowerCase().includes(lowerQuery))
      : [];
    results.push(...filteredPages);
  }

  // 3. Filter by category if specified
  let filteredResults = results;
  if (category && category !== "page") {
    filteredResults = results.filter(r => r.category === category);
  } else if (category === "page") {
    filteredResults = results.filter(r => r.category === "page");
  }

  console.log(`[SearchAPI] Total results found: ${filteredResults.length}`);

  // 4. Sort results if query exists
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredResults.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().startsWith(lowerQuery);
      const bTitleMatch = b.title.toLowerCase().startsWith(lowerQuery);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });
  }

  return NextResponse.json({ results: filteredResults });
}
