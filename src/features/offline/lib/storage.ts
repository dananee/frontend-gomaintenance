import { openDB, DBSchema, IDBPDatabase } from "idb";

interface MaintenanceDB extends DBSchema {
  workOrders: {
    key: string;
    value: {
      id: string;
      title: string;
      status: string;
      priority: string;
      updatedAt: string;
      syncStatus: "synced" | "pending" | "error";
    };
    indexes: { "by-status": string };
  };
  syncQueue: {
    key: number;
    value: {
      url: string;
      method: string;
      body: any;
      timestamp: number;
    };
  };
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

export const saveWorkOrderOffline = async (workOrder: any) => {
  const db = await initDB();
  await db.put("workOrders", { ...workOrder, syncStatus: "pending" });
};

export const getOfflineWorkOrders = async () => {
  const db = await initDB();
  return db.getAll("workOrders");
};

export const addToSyncQueue = async (request: { url: string; method: string; body: any }) => {
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
