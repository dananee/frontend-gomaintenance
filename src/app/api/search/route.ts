import { NextResponse } from "next/server";

type SearchCategory = "vehicle" | "work_order" | "part" | "user" | "page";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  category: SearchCategory;
}

const data: SearchResult[] = [
  { id: "v1", title: "2020 Ford F-150", subtitle: "ABC-123", category: "vehicle", url: "/dashboard/vehicles/v1" },
  { id: "v2", title: "2019 Honda Civic", subtitle: "XYZ-789", category: "vehicle", url: "/dashboard/vehicles/v2" },
  { id: "v3", title: "2021 Toyota Camry", subtitle: "DEF-456", category: "vehicle", url: "/dashboard/vehicles/v3" },

  { id: "wo1", title: "Brake pads replacement", subtitle: "WO-124", category: "work_order", url: "/dashboard/work-orders/wo1" },
  { id: "wo2", title: "Oil change service", subtitle: "WO-125", category: "work_order", url: "/dashboard/work-orders/wo2" },
  { id: "wo3", title: "Transmission service", subtitle: "WO-087", category: "work_order", url: "/dashboard/work-orders/wo3" },

  { id: "p1", title: "Brake Pads (Ceramic)", subtitle: "BRK-PAD-001", category: "part", url: "/dashboard/inventory/p1" },
  { id: "p2", title: "Oil Filter", subtitle: "OIL-FLT-002", category: "part", url: "/dashboard/inventory/p2" },
  { id: "p3", title: "Air Filter", subtitle: "AIR-FLT-003", category: "part", url: "/dashboard/inventory/p3" },

  { id: "u1", title: "Alex Johnson", subtitle: "Fleet Manager", category: "user", url: "/dashboard/users/u1" },
  { id: "u2", title: "Maria Garcia", subtitle: "Technician", category: "user", url: "/dashboard/users/u2" },
  { id: "u3", title: "Priya Patel", subtitle: "Parts Clerk", category: "user", url: "/dashboard/users/u3" },

  { id: "page-dashboard", title: "Dashboard", category: "page", url: "/dashboard" },
  { id: "page-maintenance", title: "Maintenance", category: "page", url: "/dashboard/maintenance" },
  { id: "page-notifications", title: "Notifications", category: "page", url: "/dashboard/notifications" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase().trim() ?? "";
  const category = searchParams.get("category") as SearchCategory | null;

  const results = data.filter((item) => {
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.subtitle?.toLowerCase().includes(query);

    const matchesCategory = !category || item.category === category;
    return matchesQuery && matchesCategory;
  });

  return NextResponse.json({ results });
}
