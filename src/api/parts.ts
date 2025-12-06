import {
    WorkOrderPartRequest,
    PaginatedPartsResponse,
    CreatePartRequestPayload,
    RejectPartRequestPayload,
    ConsumePartsPayload,
    Part
} from '@/types/parts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('token'); // Adjust based on your auth implementation

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// Parts search
export async function searchParts(query: string, page = 1, pageSize = 20): Promise<PaginatedPartsResponse> {
    return apiCall<PaginatedPartsResponse>(
        `/parts?search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
    );
}

// Part requests for a work order
export async function getPartRequests(workOrderId: string): Promise<WorkOrderPartRequest[]> {
    return apiCall<WorkOrderPartRequest[]>(`/work-orders/${workOrderId}/parts-requests`);
}

export async function createPartRequest(
    workOrderId: string,
    payload: CreatePartRequestPayload
): Promise<WorkOrderPartRequest> {
    return apiCall<WorkOrderPartRequest>(`/work-orders/${workOrderId}/parts-requests`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// Approval/Rejection
export async function approvePartRequest(requestId: string): Promise<WorkOrderPartRequest> {
    return apiCall<WorkOrderPartRequest>(`/work-orders/parts-requests/${requestId}/approve`, {
        method: 'POST',
    });
}

export async function rejectPartRequest(
    requestId: string,
    payload: RejectPartRequestPayload
): Promise<WorkOrderPartRequest> {
    return apiCall<WorkOrderPartRequest>(`/work-orders/parts-requests/${requestId}/reject`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// Supervisor views
export async function getPendingApprovals(page = 1, pageSize = 20) {
    return apiCall<{ data: WorkOrderPartRequest[]; total: number; page: number; page_size: number }>(
        `/parts-requests/pending-approvals?page=${page}&page_size=${pageSize}`
    );
}

// Technician views
export async function getMyRequests(page = 1, pageSize = 20) {
    return apiCall<{ data: WorkOrderPartRequest[]; total: number; page: number; page_size: number }>(
        `/parts-requests/my-requests?page=${page}&page_size=${pageSize}`
    );
}

// Parts consumption
export async function consumeParts(
    workOrderId: string,
    payload: ConsumePartsPayload
): Promise<{ message: string }> {
    return apiCall<{ message: string }>(`/work-orders/${workOrderId}/consume-parts`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
