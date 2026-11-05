import { create } from "zustand";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            addToWishlist: (product) => {
                const items = get().items;
                const exists = items.some((item) => item.id === product.id);
                if (exists) {
                    toast("Item already in wishlist.", { icon: "ℹ️" });
                    return;
                }

                set({ items: [...items, product] });
                toast.success(`${product.title} added to wishlist.`);
            },

            removeFromWishlist: (productId) => {
                const item = get().items.find((wishlistItem) => wishlistItem.id === productId);

                set({
                    items: get().items.filter((item) => item.id !== productId),
                });

                if (item) {
                    toast(`${item.title} removed from wishlist.`, { icon: "💔" });
                }
            },

            toggleWishlist: (product) => {
                const items = get().items;
                const exists = items.some((item) => item.id === product.id);

                if (exists) {
                    set({
                        items: items.filter((item) => item.id !== product.id),
                    });
                    toast(`${product.title} removed from wishlist.`, { icon: "💔" });
                    return false;
                }

                set({ items: [...items, product] });
                toast.success(`${product.title} added to wishlist.`);
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
