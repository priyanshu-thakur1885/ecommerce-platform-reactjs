import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCompareStore = create(
    persist(
        (set, get) => ({
            items: [],

            addProduct: (product) => {
                const items = get().items;
                const exists = items.some((item) => item.id === product.id);

                if (exists) return;

                set({
                    items: [...items, product].slice(-2),
                });
            },

            toggleProduct: (product) => {
                const items = get().items;
                const exists = items.some((item) => item.id === product.id);

                if (exists) {
                    set({
                        items: items.filter((item) => item.id !== product.id),
                    });
                    return false;
                }

                const nextItems = [...items, product].slice(-2);
                set({ items: nextItems });
                return true;
            },

            removeProduct: (productId) => {
                set({
                    items: get().items.filter((item) => item.id !== productId),
                });
            },

            clearProducts: () => {
                set({ items: [] });
            },

            hasProduct: (productId) => {
                return get().items.some((item) => item.id === productId);
            },
        }),
        {
            name: "compare-storage",
        }
    )
);

export default useCompareStore;
