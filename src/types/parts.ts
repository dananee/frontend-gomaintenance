export enum PartRequestStatus {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    SENT_TO_ODOO = 'SENT_TO_ODOO',
    ORDERED = 'ORDERED',
    RECEIVED = 'RECEIVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}

export interface Part {
    id: string;
    tenant_id: string;
    part_number: string;
    name: string;
    description?: string;
    brand?: string;
    unit_price: number;
    category?: string;
    quantity: number;
    min_quantity: number;
    location?: string;
    supplier_id?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

export interface WorkOrderPartRequest {
    id: string;
    work_order_id: string;
    part_id: string;
    tenant_id: string;
    requested_by_user_id: string;
    approved_by_user_id?: string;
    quantity: number;
    status: PartRequestStatus;
    odoo_purchase_order_id?: number;
    odoo_purchase_order_line_id?: number;
    notes?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
    approved_at?: string;
    sent_to_odoo_at?: string;
    ordered_at?: string;
    received_at?: string;
    rejected_at?: string;
    cancelled_at?: string;
    // Relations
    part?: Part;
    requested_by?: User;
    approved_by?: User;
    attachments?: OdooAttachment[];
}

export interface OdooAttachment {
    id: string;
    part_request_id: string;
    tenant_id: string;
    file_name: string;
    file_type?: string;
    file_size?: number;
    odoo_attachment_id?: number;
    storage_url: string;
    created_at: string;
}

export interface WorkOrderPartsUsage {
    id: string;
    work_order_id: string;
    part_id: string;
    part_request_id?: string;
    tenant_id: string;
    quantity_used: number;
    recorded_by_user_id: string;
    created_at: string;
    // Relations
    part?: Part;
    recorded_by?: User;
}

export interface PurchaseOrderDetails {
    id: number;
    name: string; // PO number
    state: string;
    partner_name?: string; // Supplier name
    date_order: string;
    date_planned?: string; // ETA
    amount_total?: number;
}

// API Response types
export interface PaginatedPartsResponse {
    data: Part[];
    total: number;
    page: number;
    page_size: number;
}

export interface CreatePartRequestPayload {
    part_id: string;
    quantity: number;
    notes?: string;
}

export interface ApprovePartRequestPayload {
    // Empty for now, approval is just a POST
}

export interface RejectPartRequestPayload {
    reason: string;
}

export interface ConsumePartsPayload {
    consumptions: {
        part_request_id: string;
        quantity_used: number;
    }[];
}

// Status badge color mapping
export const getStatusColor = (status: PartRequestStatus): string => {
    switch (status) {
        case PartRequestStatus.PENDING_APPROVAL:
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case PartRequestStatus.APPROVED:
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case PartRequestStatus.SENT_TO_ODOO:
        case PartRequestStatus.ORDERED:
            return 'bg-indigo-100 text-indigo-800 border-indigo-300';
        case PartRequestStatus.RECEIVED:
            return 'bg-green-100 text-green-800 border-green-300';
        case PartRequestStatus.REJECTED:
        case PartRequestStatus.CANCELLED:
            return 'bg-red-100 text-red-800 border-red-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

// Status display name
export const getStatusDisplayName = (status: PartRequestStatus): string => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};
