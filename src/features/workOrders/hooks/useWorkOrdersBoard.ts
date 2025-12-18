import { useEffect } from "react";
import { useWorkOrders } from "./useWorkOrders";
import { useWorkOrdersBoardStore } from "../store/useWorkOrdersBoardStore";
import { useWorkOrderBoardStream } from "./useWorkOrderBoardStream";

export function useWorkOrdersBoard(boardId: string = "default") {
    const { data: workOrders, isLoading, error } = useWorkOrders();
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
