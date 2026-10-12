
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./ProductCard.css";

const translations = {
    en: {
        price: "Price:",
        category: "Category:",
        condition: "Condition:",
        new: "New",
        used: "Used",
        electronics: "Electronics",
        phones: "Phones",
        computers: "Computers",
        fashion: "Fashion",
        homeGarden: "Home & Garden",
        sports: "Sports",
        vehicles: "Vehicles",
        other: "Other",
        addFavorite: "Add to favorites",
        removeFavorite: "Remove from favorites",
        loginRequired: "Please log in to save favorites.",
        updateFailed: "Failed to update favorites",
        confirmDelete: "Are you sure you want to delete this product?",
        deleteFailed: "Failed to delete product",
        deleteSuccess: "Product deleted successfully",
        edit: "Edit",
        delete: "Delete"
    },
    hy: {
        price: "Գին՝",
        category: "Կատեգորիա՝",
        condition: "Վիճակ՝",
        new: "Նոր",
        used: "Օգտագործված",
        electronics: "Էլեկտրոնիկա",
        phones: "Հեռախոսներ",
        computers: "Համակարգիչներ",
        fashion: "Հագուստ և նորաձևություն",
        homeGarden: "Տուն և այգի",
        sports: "Սպորտ",
        vehicles: "Տրանսպորտային միջոցներ",
        other: "Այլ",
        addFavorite: "Ավելացնել նախընտրածների մեջ",
        removeFavorite: "Հեռացնել նախընտրածներից",
        loginRequired: "Նախընտրածների մեջ ապրանք պահելու համար մուտք գործեք։",
        updateFailed: "Չհաջողվեց թարմացնել նախընտրածները",
        confirmDelete: "Վստա՞հ եք, որ ցանկանում եք ջնջել այս ապրանքը։",
        deleteFailed: "Չհաջողվեց ջնջել ապրանքը",
        deleteSuccess: "Ապրանքը հաջողությամբ ջնջվեց",
        edit: "Խմբագրել",
        delete: "Ջնջել"
    },
    ru: {
        price: "Цена:",
        category: "Категория:",
        condition: "Состояние:",
        new: "Новый",
        used: "Б/у",
        electronics: "Электроника",
        phones: "Телефоны",
        computers: "Компьютеры",
        fashion: "Одежда и мода",
        homeGarden: "Дом и сад",
        sports: "Спорт",
        vehicles: "Транспорт",
        other: "Другое",
        addFavorite: "Добавить в избранное",
        removeFavorite: "Убрать из избранного",
        loginRequired: "Войдите в аккаунт, чтобы добавлять товары в избранное.",
        updateFailed: "Не удалось обновить избранное",
        confirmDelete: "Вы уверены, что хотите удалить этот товар?",
        deleteFailed: "Не удалось удалить товар",
        deleteSuccess: "Товар успешно удалён",
        edit: "Изменить",
        delete: "Удалить"
    }
};

const categoryKeys = {
    electronics: "electronics",
    phones: "phones",
    computers: "computers",
    fashion: "fashion",
    "home & garden": "homeGarden",
    sports: "sports",
    vehicles: "vehicles",
    other: "other"
};

function ProductCard({ product }) {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const text = translations[language] || translations.en;
    const token = localStorage.getItem("token");

    const cardRef = useRef(null);
    const [isCardVisible, setIsCardVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    let currentUserId = null;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            currentUserId = payload.userId;
        } catch {
            currentUserId = null;
        }
    }

    const productUserId = product.user?._id || product.user;

    const isOwner =
        currentUserId &&
        productUserId &&
        currentUserId === productUserId.toString();

    const translateCondition = (condition) => {
        const key = String(condition || "").trim().toLowerCase();

        if (key === "new") return text.new;
        if (key === "used") return text.used;

        return condition;
    };

    useEffect(() => {
        const card = cardRef.current;

        if (!card) return;

        if (!("IntersectionObserver" in window)) {
            setIsCardVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsCardVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "150px" }
        );

        observer.observe(card);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!token) {
            setIsFavorite(false);
            return;
        }

        let cancelled = false;

        const loadFavorites = async () => {
            try {
                const response = await fetch(
                    "https://my-marketplace-api.onrender.com/users/favorites",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) return;

                const favorites = await response.json();

                if (!cancelled) {
                    setIsFavorite(
                        favorites.some(
                            (favorite) => favorite._id === product._id
                        )
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadFavorites();

        return () => {
            cancelled = true;
        };
    }, [product._id, token]);

    const handleFavorite = async (e) => {
        e.stopPropagation();

        if (!token) {
            window.alert(text.loginRequired);
            navigate("/login");
            return;
        }

        if (favoriteLoading) return;

        setFavoriteLoading(true);

        try {
            const response = await fetch(
                `https://my-marketplace-api.onrender.com/users/favorites/${product._id}`,
                {
                    method: isFavorite ? "DELETE" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.updateFailed);
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            window.alert(error.message);
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();

        if (!window.confirm(text.confirmDelete)) return;

        try {
            const response = await fetch(
                `https://my-marketplace-api.onrender.com/products/${product._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.deleteFailed);
            }

            window.alert(text.deleteSuccess);
            window.location.reload();
        } catch (error) {
            console.error(error);
            window.alert(error.message);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/edit-product/${product._id}`);
    };

    const handleCardClick = () => {
        navigate(`/products/${product._id}`);
    };

    const imageUrl = product.image
    ? product.image.startsWith("http")
        ? product.image
        : `https://my-marketplace-api.onrender.com${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : null;

    const categoryKey = String(product.category || "").trim().toLowerCase();
    const translatedCategoryKey = categoryKeys[categoryKey];
    const categoryToDisplay = translatedCategoryKey
        ? text[translatedCategoryKey]
        : product.category;

    return (
        <div
            ref={cardRef}
            className="product-card"
            onClick={handleCardClick}
        >
            <button
                type="button"
                className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
                onClick={handleFavorite}
                disabled={favoriteLoading}
                aria-label={isFavorite ? text.removeFavorite : text.addFavorite}
                title={isFavorite ? text.removeFavorite : text.addFavorite}
            >
                {isFavorite ? "♥" : "🤍"}
            </button>

            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={product.title || ""}
                    className="product-image"
                />
            )}

            <h2>{product.title}</h2>

            <p>
                {text.price}{" "}
                {product.currency === "AMD"
                    ? "֏"
                    : product.currency === "EUR"
                        ? "€"
                        : product.currency === "RUB"
                            ? "₽"
                            : "$"}
                {product.price}
            </p>

            <p className="product-description">
                {product.description && product.description.length > 22
                    ? product.description.slice(0, 22) + "..."
                    : product.description}
            </p>

            <p>
                {text.category} {categoryToDisplay}
            </p>

            <p>
                {text.condition} {translateCondition(product.condition)}
            </p>

            {isOwner && (
                <div className="product-actions">
                    <button onClick={handleEdit}>{text.edit}</button>
                    <button onClick={handleDelete}>{text.delete}</button>
                </div>
            )}
        </div>
    );
}

export default ProductCard;