import { create } from "zustand";
import { WorkOrder, WorkOrderStatus, WorkOrderBoardUpdateEvent } from "../types/workOrder.types";

type ColumnsState = Record<WorkOrderStatus, string[]>;

interface PendingRequest {
  clientRequestId: string;
  originalStatus: WorkOrderStatus;
  originalPosition: number;
}

interface WorkOrdersBoardState {
  workOrdersById: Record<string, WorkOrder>;
  columns: ColumnsState;
  pendingByWorkOrderId: Record<string, PendingRequest | undefined>;
  seenEventIds: Set<string>;
  setFromApi: (workOrders: WorkOrder[]) => void;
  optimisticMove: (opts: {
    id: string;
    toStatus: WorkOrderStatus;
    position: number;
    clientRequestId: string;
  }) => void;
  rollbackMove: (id: string) => void;
  applyServerEvent: (event: WorkOrderBoardUpdateEvent) => void;
  calculatePosition: (column: string[], dropIndex: number) => number;
}

const emptyColumns: ColumnsState = {
  pending: [],
  in_progress: [],
  completed: [],
  cancelled: [],
};

export const useWorkOrdersBoardStore = create<WorkOrdersBoardState>((set, get) => ({
  workOrdersById: {},
  columns: emptyColumns,
  pendingByWorkOrderId: {},
  seenEventIds: new Set<string>(),

  calculatePosition: (column, dropIndex) => {
    const state = get();

    if (column.length === 0) {
      return 1000;
    }

    if (dropIndex === 0) {
      const nextId = column[0];
      const nextPos = state.workOrdersById[nextId]?.position ?? 1000;
      return nextPos / 2;
    }

    if (dropIndex >= column.length) {
      const prevId = column[column.length - 1];
      const prevPos = state.workOrdersById[prevId]?.position ?? 1000;
      return prevPos + 1000;
    }

    const prevId = column[dropIndex - 1];
    const nextId = column[dropIndex];
    const prevPos = state.workOrdersById[prevId]?.position ?? 0;
    const nextPos = state.workOrdersById[nextId]?.position ?? 2000;

    return (prevPos + nextPos) / 2;
  },

  setFromApi: (workOrders) => {
    const byId: Record<string, WorkOrder> = {};
    const columns: ColumnsState = {
      pending: [],
      in_progress: [],
      completed: [],
      cancelled: [],
    };

    const sorted = [...workOrders].sort((a, b) => {
      const posA = a.position ?? 0;
      const posB = b.position ?? 0;
      if (posA === posB) {
        return a.created_at.localeCompare(b.created_at);
      }
      return posA - posB;
    });

    for (const wo of sorted) {
      byId[wo.id] = wo;
      if (!columns[wo.status]) {
        columns[wo.status] = [];
      }
      columns[wo.status].push(wo.id);
    }

    set({
      workOrdersById: byId,
      columns,
      pendingByWorkOrderId: {},
    });
  },

  optimisticMove: ({ id, toStatus, position, clientRequestId }) => {
    const state = get();
    const workOrder = state.workOrdersById[id];
    if (!workOrder) {
      return;
    }

    const fromStatus = workOrder.status;
    const columns: ColumnsState = {
      pending: [...state.columns.pending],
      in_progress: [...state.columns.in_progress],
      completed: [...state.columns.completed],
      cancelled: [...state.columns.cancelled],
    };

    // Remove from old column
    columns[fromStatus] = columns[fromStatus].filter((woId) => woId !== id);

    // Add to new column
    if (!columns[toStatus]) {
      columns[toStatus] = [];
    }
    columns[toStatus].push(id);

    // Sort by position
    columns[toStatus].sort((a, b) => {
      const posA = a === id ? position : (state.workOrdersById[a]?.position ?? 0);
      const posB = b === id ? position : (state.workOrdersById[b]?.position ?? 0);
      return posA - posB;
    });

    set({
      workOrdersById: {
        ...state.workOrdersById,
        [id]: {
          ...workOrder,
          status: toStatus,
          position,
        },
      },
      columns,
      pendingByWorkOrderId: {
        ...state.pendingByWorkOrderId,
        [id]: {
          clientRequestId,
          originalStatus: fromStatus,
          originalPosition: workOrder.position ?? 0,
        },
      },
    });
  },

  rollbackMove: (id) => {
    const state = get();
    const pending = state.pendingByWorkOrderId[id];
    const workOrder = state.workOrdersById[id];

    if (!pending || !workOrder) {
      return;
    }

    const currentStatus = workOrder.status;
    const columns: ColumnsState = {
      pending: [...state.columns.pending],
      in_progress: [...state.columns.in_progress],
      completed: [...state.columns.completed],
      cancelled: [...state.columns.cancelled],
    };

    // Remove from current column
    columns[currentStatus] = columns[currentStatus].filter((woId) => woId !== id);

    // Add back to original column
    columns[pending.originalStatus].push(id);

    // Sort by position
    columns[pending.originalStatus].sort((a, b) => {
      const posA = a === id ? pending.originalPosition : (state.workOrdersById[a]?.position ?? 0);
      const posB = b === id ? pending.originalPosition : (state.workOrdersById[b]?.position ?? 0);
      return posA - posB;
    });

    const pendingByWorkOrderId = { ...state.pendingByWorkOrderId };
    delete pendingByWorkOrderId[id];

    set({
      workOrdersById: {
        ...state.workOrdersById,
        [id]: {
          ...workOrder,
          status: pending.originalStatus,
          position: pending.originalPosition,
        },
      },
      columns,
      pendingByWorkOrderId,
    });
  },

  applyServerEvent: (event) => {
    const state = get();

    if (state.seenEventIds.has(event.eventId)) {
      return;
    }

    const workOrder = state.workOrdersById[event.workOrderId];
    if (!workOrder) {
      return;
    }

    const pending = state.pendingByWorkOrderId[event.workOrderId];
    const isOwnUpdate =
      pending && pending.clientRequestId && pending.clientRequestId === event.clientRequestId;

    const columns: ColumnsState = {
      pending: [...state.columns.pending],
      in_progress: [...state.columns.in_progress],
      completed: [...state.columns.completed],
      cancelled: [...state.columns.cancelled],
    };

    // Remove from current column
    if (workOrder.status !== event.toStatus) {
      columns[workOrder.status] = columns[workOrder.status].filter(
        (id) => id !== event.workOrderId
      );

      // Add to new column
      if (!columns[event.toStatus]) {
        columns[event.toStatus] = [];
      }
      if (!columns[event.toStatus].includes(event.workOrderId)) {
        columns[event.toStatus].push(event.workOrderId);
      }
    }

    // Sort by position
    columns[event.toStatus].sort((a, b) => {
      const posA = a === event.workOrderId ? event.position : (state.workOrdersById[a]?.position ?? 0);
      const posB = b === event.workOrderId ? event.position : (state.workOrdersById[b]?.position ?? 0);
      return posA - posB;
    });

    const updatedWorkOrder: WorkOrder = {
      ...workOrder,
      status: event.toStatus,
      position: event.position,
      updated_at: event.updatedAt,
    };

    const pendingByWorkOrderId = { ...state.pendingByWorkOrderId };
    if (isOwnUpdate) {
      delete pendingByWorkOrderId[event.workOrderId];
    }

    const seenEventIds = new Set(state.seenEventIds);
    seenEventIds.add(event.eventId);

    set({
      workOrdersById: {
        ...state.workOrdersById,
        [event.workOrderId]: updatedWorkOrder,
      },
      columns,
      pendingByWorkOrderId,
      seenEventIds,
    });
  },
}));


