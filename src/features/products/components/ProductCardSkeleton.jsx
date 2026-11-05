export default function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />

            <div className="p-4">
                <div className="h-3 w-20 bg-gray-200 rounded-full mb-3" />
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-3" />

                <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="w-4 h-4 bg-gray-200 rounded-full" />
                    ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                </div>

                <div className="h-9 w-full bg-gray-200 rounded-lg" />
            </div>
        </div>
    );
}
