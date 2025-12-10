import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    searchParts,
    getPartRequests,
    createPartRequest,
    approvePartRequest,
    rejectPartRequest,
    getPendingApprovals,
    getMyRequests,
    consumeParts
} from '@/api/parts';
import type {
    Part,
    WorkOrderPartRequest,
    CreatePartRequestPayload,
    RejectPartRequestPayload,
    ConsumePartsPayload
} from '@/types/parts';

// Search parts with debounce
export function useSearchParts(query: string, enabled = true) {
    return useQuery({
        queryKey: ['parts', 'search', query],
        queryFn: () => searchParts(query, 1, 20),
        enabled: enabled && query.length > 0,
        staleTime: 30000, // 30 seconds
    });
}

// Get part requests for a work order
export function usePartRequests(workOrderId: string) {
    return useQuery({
        queryKey: ['partRequests', workOrderId],
        queryFn: () => getPartRequests(workOrderId),
        staleTime: 10000, // 10 seconds
    });
}

// Create part request
export function useCreatePartRequest(workOrderId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePartRequestPayload) =>
            createPartRequest(workOrderId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partRequests', workOrderId] });
        },
    });
}

// Approve part request
export function useApprovePartRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) => approvePartRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partRequests'] });
            queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
        },
    });
}

// Reject part request
export function useRejectPartRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, payload }: { requestId: string; payload: RejectPartRequestPayload }) =>
            rejectPartRequest(requestId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partRequests'] });
            queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
        },
    });
}

// Get pending approvals (supervisor)
export function usePendingApprovals(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: ['pendingApprovals', page, pageSize],
        queryFn: () => getPendingApprovals(page, pageSize),
        staleTime: 5000, // 5 seconds
    });
}

// Get my requests (technician)
export function useMyRequests(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: ['myRequests', page, pageSize],
        queryFn: () => getMyRequests(page, pageSize),
        staleTime: 10000,
    });
}

// Consume parts
export function useConsumeParts(workOrderId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ConsumePartsPayload) =>
            consumeParts(workOrderId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partRequests', workOrderId] });
        },
    });
}
