const API_URL = "https://my-marketplace-api.onrender.com";

export const getProducts = async (search = "") => {
    const params = new URLSearchParams({ limit: "100" });

    if (search.trim()) {
        params.set("title", search.trim());
    }

    const response = await fetch(`${API_URL}/products?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to get products");
    }

    return response.json();
};