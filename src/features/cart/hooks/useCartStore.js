import { create } from "zustand";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
    items: [],

    addToCart: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                toast.error(`Only ${product.stock} ${product.stock === 1 ? "item" : "items"} left in stock.`);
                return;
            }

            set({
                items: items.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
            toast.success(`${product.title} quantity updated in cart.`);
            return;
        }

        set({
            items: [...items, { ...product, quantity: 1 }],
        });
        toast.success(`${product.title} added to cart.`);
    },

    removeFromCart: (productId) => {
        const item = get().items.find((cartItem) => cartItem.id === productId);

        set({
            items: get().items.filter((item) => item.id !== productId),
        });

        if (item) {
            toast(`Removed ${item.title} from cart.`, {
                icon: "🛒",
            });
        }
    },

    updateQuantity: (productId, newQuantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === productId);

        if (!item) return;

        if (newQuantity < 1) {
            set({
                items: items.filter((i) => i.id !== productId),
            });
            toast(`Removed ${item.title} from cart.`, {
                icon: "🗑️",
            });
            return;
        }

        if (newQuantity > item.stock) {
            toast.error(`Only ${item.stock} ${item.stock === 1 ? "item" : "items"} left in stock.`);
            return;
        }

        set({
            items: items.map((i) =>
                i.id === productId ? { ...i, quantity: newQuantity } : i
            ),
        });
    },

    clearCart: () => {
        set({ items: [] });
        toast("Cart cleared.", { icon: "✅" });
    },

    get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    get totalPrice() {
        return get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    },

    getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    getTotalPrice: () => {
        return get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    },
}));

export default useCartStore;
