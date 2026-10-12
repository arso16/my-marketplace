
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

const translations = {
    en: {
        description: "Find exactly what you need",
        loading: "Loading products...",
        error: "Could not load products. Please try again.",
        empty: "No products match your filters.",
        filters: "Filters",
        search: "Search products",
        searchPlaceholder: "Name or description",
        minPrice: "Minimum price",
        maxPrice: "Maximum price",
        condition: "Condition",
        allConditions: "All conditions",
        new: "New",
        used: "Used",
        sort: "Sort by",
        newest: "Newest first",
        oldest: "Oldest first",
        priceLow: "Price: low to high",
        priceHigh: "Price: high to low",
        apply: "Apply filters",
        reset: "Reset filters",
        results: "products found",
        noMin: "No minimum",
        noMax: "No maximum"
    },
    hy: {
        description: "Գտեք ձեզ անհրաժեշտը",
        loading: "Ապրանքները բեռնվում են...",
        error: "Չհաջողվեց բեռնել ապրանքները։ Խնդրում ենք կրկին փորձել։",
        empty: "Ձեր զտիչներին համապատասխանող ապրանքներ չկան։",
        filters: "Զտիչներ",
        search: "Փնտրել ապրանքներ",
        searchPlaceholder: "Անվանում կամ նկարագրություն",
        minPrice: "Նվազագույն գին",
        maxPrice: "Առավելագույն գին",
        condition: "Վիճակ",
        allConditions: "Բոլոր վիճակները",
        new: "Նոր",
        used: "Օգտագործված",
        sort: "Դասավորել ըստ",
        newest: "Նորերը սկզբում",
        oldest: "Հները սկզբում",
        priceLow: "Գին՝ ցածրից բարձր",
        priceHigh: "Գին՝ բարձրից ցածր",
        apply: "Կիրառել զտիչները",
        reset: "Մաքրել զտիչները",
        results: "ապրանք գտնվեց",
        noMin: "Առանց նվազագույնի",
        noMax: "Առանց առավելագույնի"
    },
    ru: {
        description: "Найдите то, что вам нужно",
        loading: "Загрузка товаров...",
        error: "Не удалось загрузить товары. Попробуйте ещё раз.",
        empty: "По вашим фильтрам товары не найдены.",
        filters: "Фильтры",
        search: "Поиск товаров",
        searchPlaceholder: "Название или описание",
        minPrice: "Минимальная цена",
        maxPrice: "Максимальная цена",
        condition: "Состояние",
        allConditions: "Любое состояние",
        new: "Новый",
        used: "Бывший в употреблении",
        sort: "Сортировать",
        newest: "Сначала новые",
        oldest: "Сначала старые",
        priceLow: "Цена: по возрастанию",
        priceHigh: "Цена: по убыванию",
        apply: "Применить фильтры",
        reset: "Сбросить фильтры",
        results: "товаров найдено",
        noMin: "Без минимума",
        noMax: "Без максимума"
    }
};

const standardCategories = [
    "Electronics",
    "Phones",
    "Computers",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Vehicles",
    "Other"
];

const categoryNames = {
    Electronics: {
        en: "Electronics",
        hy: "Էլեկտրոնիկա",
        ru: "Электроника"
    },
    Phones: {
        en: "Phones",
        hy: "Հեռախոսներ",
        ru: "Телефоны"
    },
    Computers: {
        en: "Computers",
        hy: "Համակարգիչներ",
        ru: "Компьютеры"
    },
    Fashion: {
        en: "Fashion",
        hy: "Նորաձևություն",
        ru: "Мода"
    },
    "Home & Garden": {
        en: "Home & Garden",
        hy: "Տուն և այգի",
        ru: "Дом и сад"
    },
    Sports: {
        en: "Sports",
        hy: "Սպորտ",
        ru: "Спорт"
    },
    Vehicles: {
        en: "Vehicles",
        hy: "Տրանսպորտային միջոցներ",
        ru: "Транспорт"
    },
    Other: {
        en: "Other",
        hy: "Այլ",
        ru: "Другое"
    }
};

const normalizeCategory = (value) =>
    String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

function CategoryPage() {
    const { category } = useParams();
    const { language } = useLanguage();
    const text = translations[language] || translations.en;
    const selectedCategory = decodeURIComponent(category || "");
    const isOtherCategory =
        normalizeCategory(selectedCategory) === "other";

    const translatedCategory =
        categoryNames[selectedCategory]?.[language] ||
        categoryNames[selectedCategory]?.en ||
        selectedCategory;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchText, setSearchText] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [condition, setCondition] = useState("all");
    const [sort, setSort] = useState("newest");
    const [appliedFilters, setAppliedFilters] = useState({
        searchText: "",
        minPrice: "",
        maxPrice: "",
        condition: "all",
        sort: "newest"
    });

    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://192.168.123.14:3000/products?limit=100"
                );

                if (!response.ok) {
                    throw new Error("Product request failed");
                }

                const data = await response.json();

                const allProducts = Array.isArray(data)
                    ? data
                    : Array.isArray(data.products)
                      ? data.products
                      : [];

                const filteredProducts = allProducts.filter((product) => {
                    const productCategory = normalizeCategory(
                        product.category
                    );

                    if (isOtherCategory) {
                        return (
                            productCategory === "other" ||
                            !standardCategories.some(
                                (standardCategory) =>
                                    normalizeCategory(standardCategory) ===
                                    productCategory
                            )
                        );
                    }

                    return (
                        productCategory ===
                        normalizeCategory(selectedCategory)
                    );
                });

                if (!cancelled) {
                    setProducts(filteredProducts);
                }
            } catch {
                if (!cancelled) {
                    setError(text.error);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, [selectedCategory, isOtherCategory, language, text.error]);

    const visibleProducts = useMemo(() => {
        const searchValue = appliedFilters.searchText.trim().toLowerCase();
        const min = appliedFilters.minPrice === ""
            ? null
            : Number(appliedFilters.minPrice);
        const max = appliedFilters.maxPrice === ""
            ? null
            : Number(appliedFilters.maxPrice);

        const result = products.filter((product) => {
            const searchableText =
                `${product.title || ""} ${product.description || ""}`.toLowerCase();

            if (searchValue && !searchableText.includes(searchValue)) {
                return false;
            }

            const price = Number(product.price);

            if (min !== null && Number.isFinite(min) && price < min) {
                return false;
            }

            if (max !== null && Number.isFinite(max) && price > max) {
                return false;
            }

            if (
                appliedFilters.condition !== "all" &&
                normalizeCategory(product.condition) !==
                    normalizeCategory(appliedFilters.condition)
            ) {
                return false;
            }

            return true;
        });

        return result.sort((a, b) => {
            if (appliedFilters.sort === "priceLow") {
                return Number(a.price) - Number(b.price);
            }

            if (appliedFilters.sort === "priceHigh") {
                return Number(b.price) - Number(a.price);
            }

            const dateA = new Date(a.createdAt || a._id || 0).getTime();
            const dateB = new Date(b.createdAt || b._id || 0).getTime();

            if (appliedFilters.sort === "oldest") {
                return dateA - dateB;
            }

            return dateB - dateA;
        });
    }, [products, appliedFilters]);

    const applyFilters = (event) => {
        event.preventDefault();

        setAppliedFilters({
            searchText,
            minPrice,
            maxPrice,
            condition,
            sort
        });
    };

    const resetFilters = () => {
        setSearchText("");
        setMinPrice("");
        setMaxPrice("");
        setCondition("all");
        setSort("newest");
        setAppliedFilters({
            searchText: "",
            minPrice: "",
            maxPrice: "",
            condition: "all",
            sort: "newest"
        });
    };

    return (
        <main className="category-page">
            <header className="category-page-header">
                <h1>{translatedCategory}</h1>
                <p className="category-description">{text.description}</p>
            </header>

            <div className="category-layout">
                <aside className="category-filter-panel">
                    <h2>{text.filters}</h2>

                    <form onSubmit={applyFilters}>
                        <label htmlFor="category-search">
                            {text.search}
                        </label>
                        <input
                            id="category-search"
                            type="search"
                            placeholder={text.searchPlaceholder}
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(event.target.value)
                            }
                        />

                        <label htmlFor="category-min-price">
                            {text.minPrice}
                        </label>
                        <input
                            id="category-min-price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={text.noMin}
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(event.target.value)
                            }
                        />

                        <label htmlFor="category-max-price">
                            {text.maxPrice}
                        </label>
                        <input
                            id="category-max-price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={text.noMax}
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(event.target.value)
                            }
                        />

                        <label htmlFor="category-condition">
                            {text.condition}
                        </label>
                        <select
                            id="category-condition"
                            value={condition}
                            onChange={(event) =>
                                setCondition(event.target.value)
                            }
                        >
                            <option value="all">{text.allConditions}</option>
                            <option value="new">{text.new}</option>
                            <option value="used">{text.used}</option>
                        </select>

                        <label htmlFor="category-sort">{text.sort}</label>
                        <select
                            id="category-sort"
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                        >
                            <option value="newest">{text.newest}</option>
                            <option value="oldest">{text.oldest}</option>
                            <option value="priceLow">{text.priceLow}</option>
                            <option value="priceHigh">{text.priceHigh}</option>
                        </select>

                        <button
                            className="category-apply-button"
                            type="submit"
                        >
                            {text.apply}
                        </button>

                        <button
                            className="category-reset-button"
                            type="button"
                            onClick={resetFilters}
                        >
                            {text.reset}
                        </button>
                    </form>
                </aside>

                <section className="category-results">
                    <div className="category-results-heading">
                        <h2>{translatedCategory}</h2>
                        {!loading && !error && (
                            <span>
                                {visibleProducts.length} {text.results}
                            </span>
                        )}
                    </div>

                    {loading && <p>{text.loading}</p>}

                    {!loading && error && (
                        <p className="category-error">{error}</p>
                    )}

                    {!loading && !error && visibleProducts.length === 0 && (
                        <p className="category-empty">{text.empty}</p>
                    )}

                    {!loading && !error && visibleProducts.length > 0 && (
                        <div className="category-products">
                            {visibleProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default CategoryPage;