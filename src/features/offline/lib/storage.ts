import { openDB, DBSchema, IDBPDatabase } from "idb";

interface MaintenanceDB extends DBSchema {
  workOrders: {
    key: string;
    value: OfflineWorkOrder;
    indexes: { "by-status": string };
  };
  syncQueue: {
    key: number;
    value: SyncRequest;
  };
}

type SyncRequestBody = Record<string, unknown> | string | null | undefined;

export interface OfflineWorkOrder {
  id: string;
  title: string;
  status: string;
  priority: string;
  updatedAt: string;
  syncStatus: "synced" | "pending" | "error";
}

interface SyncRequest {
  url: string;
  method: string;
  body?: SyncRequestBody;
  timestamp: number;
}

let dbPromise: Promise<IDBPDatabase<MaintenanceDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<MaintenanceDB>("maintenance-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("workOrders")) {
          const store = db.createObjectStore("workOrders", { keyPath: "id" });
          store.createIndex("by-status", "status");
        }
        if (!db.objectStoreNames.contains("syncQueue")) {
          db.createObjectStore("syncQueue", { autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
};

export const saveWorkOrderOffline = async (workOrder: OfflineWorkOrder) => {
  const db = await initDB();
  await db.put("workOrders", { ...workOrder, syncStatus: "pending" });
};

export const getOfflineWorkOrders = async () => {
  const db = await initDB();
  return db.getAll("workOrders");
};

export const addToSyncQueue = async (request: Omit<SyncRequest, "timestamp">) => {
  const db = await initDB();
  await db.add("syncQueue", {
    ...request,
    timestamp: Date.now(),
  });
};

export const getSyncQueue = async () => {
  const db = await initDB();
  return db.getAll("syncQueue");
};

export const clearSyncQueue = async () => {
  const db = await initDB();
  await db.clear("syncQueue");
};
