import { WorkOrderPartRequest, PartRequestStatus, getStatusColor, getStatusDisplayName } from '@/types/parts';

interface StatusBadgeProps {
    status: PartRequestStatus;
    className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const colorClass = getStatusColor(status);
    const displayName = getStatusDisplayName(status);

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} ${className}`}
        >
            {displayName}
        </span>
    );
}

interface StatusTimelineProps {
    request: WorkOrderPartRequest;
}

export function StatusTimeline({ request }: StatusTimelineProps) {
    const steps = [
        {
            name: 'Requested',
            status: PartRequestStatus.PENDING_APPROVAL,
            timestamp: request.created_at,
            completed: true,
        },
        {
            name: 'Approved',
            status: PartRequestStatus.APPROVED,
            timestamp: request.approved_at,
            completed: !!request.approved_at,
        },
        {
            name: 'Ordered',
            status: PartRequestStatus.ORDERED,
            timestamp: request.ordered_at,
            completed: !!request.ordered_at,
        },
        {
            name: 'Received',
            status: PartRequestStatus.RECEIVED,
            timestamp: request.received_at,
            completed: !!request.received_at,
        },
    ];

    // Handle rejected/cancelled states
    if (request.status === PartRequestStatus.REJECTED) {
        return (
            <div className="flex items-center space-x-2">
                <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 border-2 border-red-500">
                        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <span className="ml-3 text-sm font-medium text-red-600">Rejected</span>
                </div>
                {request.rejection_reason && (
                    <span className="text-xs text-gray-500">- {request.rejection_reason}</span>
                )}
            </div>
        );
    }

    if (request.status === PartRequestStatus.CANCELLED) {
        return (
            <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border-2 border-gray-400">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-600">Cancelled</span>
            </div>
        );
    }

    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                        {step.completed ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    {stepIdx !== steps.length - 1 && (
                                        <div className="h-0.5 w-full bg-indigo-600" />
                                    )}
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900 transition-colors">
                                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="sr-only">{step.name}</span>
                                </div>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                                    {step.name}
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    {stepIdx !== steps.length - 1 && (
                                        <div className="h-0.5 w-full bg-gray-200" />
                                    )}
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                                    <span className="sr-only">{step.name}</span>
                                </div>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                                    {step.name}
                                </span>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
