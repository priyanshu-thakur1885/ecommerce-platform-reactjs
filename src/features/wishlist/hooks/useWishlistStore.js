import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            addToWishlist: (product) => {
                const items = get().items;
                const exists = items.some((item) => item.id === product.id);
                if (exists) return;
                set({ items: [...items, product] });
            },

            removeFromWishlist: (productId) => {
                set({
                    items: get().items.filter((item) => item.id !== productId),
                });
            },

            toggleWishlist: (product) => {
                const items = get().items;
                const exists = items.some((item) => item.id === product.id);

                if (exists) {
                    set({
                        items: items.filter((item) => item.id !== product.id),
                    });
                    return false;
                }

                set({ items: [...items, product] });
                return true;
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.id === productId);
            },
        }),
        {
            name: "wishlist-storage",
        }
    )
);

export default useWishlistStore;
