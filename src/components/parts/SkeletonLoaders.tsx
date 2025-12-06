export function PartRequestsSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                            </div>
                            <div className="h-6 w-20 bg-gray-200 rounded-full" />
                            <div className="h-6 w-24 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SearchResultsSkeleton() {
    return (
        <div className="space-y-2 mt-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32" />
                                <div className="h-3 bg-gray-200 rounded w-24" />
                            </div>
                        </div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TimelineSkeleton() {
    return (
        <div className="flex items-center justify-between p-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center space-y-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
            ))}
        </div>
    );
}
