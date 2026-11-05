import { useState, useEffect } from "react";
import { getProducts } from "../features/products/services/productService";
import useCompareStore from "../features/compare/hooks/useCompareStore";

const comparisonFields = [
    { label: "Price", key: "price", format: (v) => `$${v?.toFixed(2) || "—"}` },
    { label: "Category", key: "category", format: (v) => v || "—" },
    { label: "Rating", key: "rating", format: (v) => (v ? `${v} / 5` : "—") },
    { label: "Stock", key: "stock", format: (v) => (v != null ? `${v} units` : "—") },
];

const getWinner = (key, valueA, valueB) => {
    if (valueA == null || valueB == null) return null;

    if (key === "price") {
        if (valueA < valueB) return "A";
        if (valueB < valueA) return "B";
        return "tie";
    }

    if (key === "rating" || key === "stock") {
        if (valueA > valueB) return "A";
        if (valueB > valueA) return "B";
        return "tie";
    }

    return null;
};

export default function ComparePage() {
    const [products, setProducts] = useState([]);
    const compareItems = useCompareStore((s) => s.items);
    const clearProducts = useCompareStore((s) => s.clearProducts);
    const [selectedProductA, setSelectedProductA] = useState(compareItems[0]?.id?.toString() || "");
    const [selectedProductB, setSelectedProductB] = useState(compareItems[1]?.id?.toString() || "");

    useEffect(() => {
        async function load() {
            const allProducts = await getProducts();
            setProducts(allProducts);
        }
        load();
    }, []);

    useEffect(() => {
        setSelectedProductA(compareItems[0]?.id?.toString() || "");
        setSelectedProductB(compareItems[1]?.id?.toString() || "");
    }, [compareItems]);

    const productA = products.find((p) => p.id === Number(selectedProductA));
    const productB = products.find((p) => p.id === Number(selectedProductB));

    const handleAChange = (value) => {
        if (value && value === selectedProductB) {
            setSelectedProductB("");
        }

        setSelectedProductA(value);
    };

    const handleBChange = (value) => {
        if (value && value === selectedProductA) {
            setSelectedProductA("");
        }

        setSelectedProductB(value);
    };

    const filterOptionsA = products.filter((p) => p.id !== Number(selectedProductB));
    const filterOptionsB = products.filter((p) => p.id !== Number(selectedProductA));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
                <p className="text-gray-500 mt-1">
                    Select two products to compare them side by side
                </p>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => {
                        setSelectedProductA("");
                        setSelectedProductB("");
                        clearProducts();
                    }}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-red-200 hover:text-red-500 transition-colors"
                >
                    Clear Selection
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product A
                    </label>
                    <select
                        value={selectedProductA}
                        onChange={(e) => handleAChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                        <option value="">Select a product...</option>
                        {filterOptionsA.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product B
                    </label>
                    <select
                        value={selectedProductB}
                        onChange={(e) => handleBChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                        <option value="">Select a product...</option>
                        {filterOptionsB.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {productA || productB ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-3 border-b border-gray-100">
                        <div className="p-4 bg-gray-50 font-medium text-sm text-gray-500">
                            Feature
                        </div>
                        <div className="p-4 text-center border-l border-gray-100">
                            {productA ? (
                                <div>
                                    <img
                                        src={productA.thumbnail}
                                        alt={productA.title}
                                        className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                                    />
                                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                                        {productA.title}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 py-8">Select Product A</p>
                            )}
                        </div>
                        <div className="p-4 text-center border-l border-gray-100">
                            {productB ? (
                                <div>
                                    <img
                                        src={productB.thumbnail}
                                        alt={productB.title}
                                        className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                                    />
                                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                                        {productB.title}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 py-8">Select Product B</p>
                            )}
                        </div>
                    </div>

                    {comparisonFields.map((field) => {
                        const valueA = productA?.[field.key];
                        const valueB = productB?.[field.key];
                        const winner = getWinner(field.key, valueA, valueB);

                        return (
                            <div
                                key={field.key}
                                className="grid grid-cols-3 border-b border-gray-50 last:border-0"
                            >
                                <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600">
                                    {field.label}
                                </div>
                                <div
                                    className={`p-4 text-center text-sm border-l border-gray-100 ${winner === "A"
                                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                                        : "text-gray-800"
                                        }`}
                                >
                                    {productA ? field.format(valueA) : "—"}
                                </div>
                                <div
                                    className={`p-4 text-center text-sm border-l border-gray-100 ${winner === "B"
                                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                                        : "text-gray-800"
                                        }`}
                                >
                                    {productB ? field.format(valueB) : "—"}
                                </div>
                            </div>
                        );
                    })}

                    <div className="grid grid-cols-3 border-t border-gray-100">
                        <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600">
                            Description
                        </div>
                        <div className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed">
                            {productA?.description || "—"}
                        </div>
                        <div className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed">
                            {productB?.description || "—"}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                    <svg
                        className="w-20 h-20 text-gray-200 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Select Products to Compare
                    </h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto">
                        Choose two products from the dropdowns above to see a detailed
                        side-by-side comparison.
                    </p>
                </div>
            )}
        </div>
    );
}
