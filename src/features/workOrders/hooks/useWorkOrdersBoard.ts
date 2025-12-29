import { useEffect } from "react";
import { useWorkOrders } from "./useWorkOrders";
import { useWorkOrdersBoardStore } from "../store/useWorkOrdersBoardStore";
import { useWorkOrderBoardStream } from "./useWorkOrderBoardStream";

export function useWorkOrdersBoard(boardId: string = "default", showArchived: boolean = false) {
    const { data: workOrders, isLoading, error } = useWorkOrders({ show_archived: showArchived, page_size: 100 });
    const setFromApi = useWorkOrdersBoardStore((state) => state.setFromApi);

    // Subscribe to WebSocket stream
    useWorkOrderBoardStream(boardId);

    // Initialize store when data loads
    useEffect(() => {
        if (workOrders?.data) {
            setFromApi(workOrders.data);
        }
    }, [workOrders?.data, setFromApi]);

    return {
        isLoading,
        error,
        isInitialized: !!workOrders?.data,
    };
}
