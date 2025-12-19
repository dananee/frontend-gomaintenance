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
  const query = searchParams.get("query")?.toLowerCase().trim() ?? "";
  const category = searchParams.get("category") as SearchCategory | null;
  const authHeader = request.headers.get("Authorization");

  console.log(`[SearchAPI] Query: "${query}", Category: "${category}"`);

  if (!query && !category) {
    return NextResponse.json({ results: [] });
  }

  const fetchBackend = async (endpoint: string) => {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      if (query) url.searchParams.set("search", query);
      url.searchParams.set("page_size", "5");

      const res = await fetch(url.toString(), {
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error(`Backend error at ${endpoint}: ${res.status}`);
        return { data: [] };
      }
      return await res.json();
    } catch (e) {
      console.error(`Error fetching from ${endpoint}:`, e);
      return { data: [] };
    }
  };

  let results: SearchResult[] = [];
  const promises: Promise<void>[] = [];

  if (!category || category === "vehicle") {
    promises.push(
      fetchBackend("/vehicles").then((resp) => {
        const items = resp.data || [];
        items.forEach((v: any) => {
          const vehicle = v.vehicle || v;
          results.push({
            id: vehicle.id,
            title: `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() || vehicle.plate_number,
            subtitle: vehicle.plate_number,
            category: "vehicle",
            url: `/dashboard/vehicles/${vehicle.id}`,
          });
        });
      })
    );
  }

  if (!category || category === "part") {
    promises.push(
      fetchBackend("/parts").then((resp) => {
        const items = resp.data || [];
        items.forEach((p: any) => {
          results.push({
            id: p.id,
            title: p.name,
            subtitle: p.part_number,
            category: "part",
            url: `/dashboard/inventory/${p.id}`,
          });
        });
      })
    );
  }

  if (!category || category === "work_order") {
    promises.push(
      fetchBackend("/work-orders").then((resp) => {
        const items = resp.data || [];
        items.forEach((wo: any) => {
          results.push({
            id: wo.id,
            title: wo.title,
            subtitle: `ID: ${wo.id.substring(0, 8)}`,
            category: "work_order",
            url: `/dashboard/work-orders/${wo.id}`,
          });
        });
      })
    );
  }

  if (!category || category === "user") {
    promises.push(
      fetchBackend("/users").then((resp) => {
        const items = resp.data || [];
        items.forEach((u: any) => {
          results.push({
            id: u.id,
            title: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email,
            subtitle: u.role,
            category: "user",
            url: `/dashboard/users/${u.id}`,
          });
        });
      })
    );
  }

  if (!category || category === "page") {
    const filteredPages = query
      ? staticPages.filter((p) => p.title.toLowerCase().includes(query))
      : staticPages;
    results.push(...filteredPages);
  }

  await Promise.allSettled(promises);

  console.log(`[SearchAPI] Total results found: ${results.length}`);

  if (query) {
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().startsWith(query);
      const bTitleMatch = b.title.toLowerCase().startsWith(query);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });
  }

  return NextResponse.json({ results });
}
