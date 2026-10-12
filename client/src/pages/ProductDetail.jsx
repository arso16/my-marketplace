
    import { useEffect, useState } from "react";
    import { useParams, Link, useNavigate } from "react-router-dom";
    import { useLanguage } from "../LanguageContext";
    import productTranslations from "../productTranslations";
    import "./ProductDetail.css";


    const translations = {
        en: {
            loading: "Loading...",
            failed: "Failed to get product",
            back: "Back to Marketplace",
            notFound: "Product not found",
            noImage: "No Image",
            category: "Category:",
            condition: "Condition:",
            description: "Description",
            seller: "Seller",
            moreProducts: "More Products",
            showMore: "Show More",
            showLess: "Show Less",
            new: "New",
            used: "Used",
            phone: "Phone",
            instagram: "Instagram",
            facebook: "Facebook",
            sendMessage: "Send Message",
            electronics: "Electronics",
            phones: "Phones",
            computers: "Computers",
            fashion: "Fashion",
            homeGarden: "Home & Garden",
            sports: "Sports",
            vehicles: "Vehicles",
            other: "Other"
        },
        hy: {
            loading: "Բեռնվում է...",
            failed: "Չհաջողվեց բեռնել ապրանքը",
            back: "Վերադառնալ շուկա",
            notFound: "Ապրանքը չի գտնվել",
            noImage: "Նկար չկա",
            category: "Կատեգորիա՝",
            condition: "Վիճակ՝",
            description: "Նկարագրություն",
            seller: "Վաճառող",
            moreProducts: "Այլ ապրանքներ",
            showMore: "Ցույց տալ ավելին",
            showLess: "Ցույց տալ ավելի քիչ",
            new: "Նոր",
            used: "Օգտագործված",
            phone: "Հեռախոս",
            instagram: "Instagram",
            facebook: "Facebook",
            sendMessage: "Ուղարկել հաղորդագրություն",
            electronics: "Էլեկտրոնիկա",
            phones: "Հեռախոսներ",
            computers: "Համակարգիչներ",
            fashion: "Նորաձևություն",
            homeGarden: "Տուն և այգի",
            sports: "Սպորտ",
            vehicles: "Տրանսպորտ",
            other: "Այլ"
        },
        ru: {
            loading: "Загрузка...",
            failed: "Не удалось загрузить товар",
            back: "Вернуться на торговую площадку",
            notFound: "Товар не найден",
            noImage: "Нет изображения",
            category: "Категория:",
            condition: "Состояние:",
            description: "Описание",
            seller: "Продавец",
            moreProducts: "Другие товары",
            showMore: "Показать больше",
            showLess: "Показать меньше",
            new: "Новый",
            used: "Бывший в употреблении",
            phone: "Телефон",
            instagram: "Instagram",
            facebook: "Facebook",
            sendMessage: "Написать продавцу",
            electronics: "Электроника",
            phones: "Телефоны",
            computers: "Компьютеры",
            fashion: "Мода",
            homeGarden: "Дом и сад",
            sports: "Спорт",
            vehicles: "Транспорт",
            other: "Другое"
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

    function ProductDetails() {
        const { id } = useParams();
        const navigate = useNavigate();
        const { language } = useLanguage();
        const text = translations[language] || translations.en;

        const [product, setProduct] = useState(null);
        const [relatedProducts, setRelatedProducts] = useState([]);
        const [visibleCount, setVisibleCount] = useState(10);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");

        const translateDescription = (description) => {
            if (!description) return "";

            const source = String(description).trim();

            for (const lang of Object.keys(productTranslations)) {
                const dictionary = productTranslations[lang];

                for (const [original, translated] of Object.entries(dictionary)) {
                    if (
                        source.toLowerCase() === original.toLowerCase() ||
                        source.toLowerCase() === String(translated).toLowerCase()
                    ) {
                        return dictionary[language] || source;
                    }
                }
            }

            return source;
        };

        useEffect(() => {
            const loadProducts = async () => {
                setLoading(true);
                setError("");
                setProduct(null);
                setVisibleCount(10);

                try {
                    const [productResponse, productsResponse] =
                        await Promise.all([
                            fetch(`https://my-marketplace-api.onrender.com/products/${id}`),
                            fetch("https://my-marketplace-api.onrender.com/products?limit=100")
                        ]);

                    const productData = await productResponse.json();
                    const productsData = await productsResponse.json();

                    if (!productResponse.ok) {
                        throw new Error(productData.message || text.failed);
                    }

                    setProduct(productData);

                    const allProducts = Array.isArray(productsData)
                        ? productsData
                        : productsData.products || [];

                    setRelatedProducts(
                        allProducts.filter(
                            (item) => item._id !== productData._id
                        )
                    );
                } catch (err) {
                    console.log(err);
                    setError(err.message || text.failed);
                } finally {
                    setLoading(false);
                }
            };

            loadProducts();
        }, [id]);

        const getImageUrl = (image) => {
            if (!image) return null;

            return image.startsWith("http")
                ? image
                : `https://my-marketplace-api.onrender.com${image}`;
        };

        const translateCondition = (condition) => {
            const key = String(condition || "").toLowerCase().trim();

            if (key === "new") return text.new;
            if (key === "used") return text.used;

            return condition;
        };

        const translateCategory = (category) => {
            const key = String(category || "").toLowerCase().trim();
            const translationKey = categoryKeys[key];

            return translationKey ? text[translationKey] : category;
        };

        const formatPrice = (product) => {
            const symbols = {
                AMD: "֏",
                USD: "$",
                EUR: "€",
                RUB: "₽"
            };

            const currency = product.currency || "USD";
            const symbol = symbols[currency] || "$";

            return `${symbol}${product.price}`;
        };

        if (loading) {
            return (
                <div className="product-details-page">
                    <h1>{text.loading}</h1>
                </div>
            );
        }

        if (error) {
            return (
                <div className="product-details-page">
                    <h1>{error}</h1>
                    <Link className="back-home" to="/">
                        {text.back}
                    </Link>
                </div>
            );
        }

        if (!product) {
            return (
                <div className="product-details-page">
                    <h1>{text.notFound}</h1>
                    <Link className="back-home" to="/">
                        {text.back}
                    </Link>
                </div>
            );
        }

        const imageUrl = getImageUrl(product.image);
        const displayedProducts = relatedProducts.slice(0, visibleCount);

        return (
            <div className="product-details-page">
                <div className="product-details">
                    <div className="product-details-image">
                        {imageUrl ? (
                            <img src={imageUrl} alt={product.title} />
                        ) : (
                            <div className="no-image">{text.noImage}</div>
                        )}
                    </div>

                    <div className="product-details-info">
                        <h1>{product.title}</h1>

                        <h2>{formatPrice(product)}</h2>

                        <div className="product-info-row">
                            <strong>{text.category}</strong>
                            <span>{translateCategory(product.category)}</span>
                        </div>

                        <div className="product-info-row">
                            <strong>{text.condition}</strong>
                            <span>{translateCondition(product.condition)}</span>
                        </div>

                        <div className="description-section">
                            <h3>{text.description}</h3>
                            <p>{translateDescription(product.description)}</p>
                        </div>


                        {product.user && (
                            <div className="seller-section">
                                <h3>{text.seller}</h3>

                                <Link
                                    to={`/sellers/${product.user._id}`}
                                    className="seller-name-link"
                                >
                                    {product.user.name || product.user.email}
                                </Link>

                                {product.user.email && (
                                    <p>{product.user.email}</p>
                                )}

                                {product.user.phoneNumber && (
                                    <p>
                                        <strong>{text.phone}: </strong>
                                        <a href={`tel:${product.user.phoneNumber}`}>
                                            {product.user.phoneNumber}
                                        </a>
                                    </p>
                                )}

                                {product.user.instagram && (
                                    <p>
                                        <strong>{text.instagram}: </strong>
                                        <a
                                            href={
                                                product.user.instagram.startsWith("http")
                                                    ? product.user.instagram
                                                    : `https://www.instagram.com/${product.user.instagram.replace(/^@/, "")}/`
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Instagram
                                        </a>
                                    </p>
                                )}

                                {product.user.facebook && (
                                    <p>
                                        <strong>{text.facebook}: </strong>
                                        <a
                                            href={product.user.facebook.startsWith("http")
                                                ? product.user.facebook
                                                : `https://www.facebook.com/${product.user.facebook}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Facebook
                                        </a>
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="send-message-button"
                                    onClick={() => navigate(`/messages?product=${product._id}&seller=${product.user._id}`)}
                                >
                                    {text.sendMessage}
                                </button>
                            </div>
                        )}

                        <Link className="back-home" to="/">
                            {text.back}
                        </Link>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <h2>{text.moreProducts}</h2>

                        <div className="related-products-grid">
                            {displayedProducts.map((item) => {
                                const itemImage = getImageUrl(item.image);

                                return (
                                    <div
                                        className="related-product-card"
                                        key={item._id}
                                        onClick={() =>
                                            navigate(`/products/${item._id}`)
                                        }
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                navigate(`/products/${item._id}`);
                                            }
                                        }}
                                    >
                                        {itemImage ? (
                                            <img
                                                src={itemImage}
                                                alt={item.title}
                                            />
                                        ) : (
                                            <div className="related-no-image">
                                                {text.noImage}
                                            </div>
                                        )}

                                        <div className="related-product-info">
                                            <h3>{item.title}</h3>
                                            <p className="related-product-price">
                                                {formatPrice(item)}
                                            </p>
                                            <p>
                                                {translateCondition(item.condition)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="related-products-controls">
                            {relatedProducts.length > 10 &&
                                visibleCount === 10 && (
                                    <button
                                        type="button"
                                        className="related-products-button"
                                        onClick={() => setVisibleCount(20)}
                                    >
                                        {text.showMore}
                                    </button>
                                )}

                            {visibleCount > 10 && (
                                <button
                                    type="button"
                                    className="related-products-button"
                                    onClick={() => setVisibleCount(10)}
                                >
                                    {text.showLess}
                                </button>
                            )}
                        </div>
                    </section>
                )}
            </div>
        );
    }

    export default ProductDetails;