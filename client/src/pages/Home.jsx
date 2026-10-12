
import { useLanguage } from "../LanguageContext";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";


const slides = [
    {
        title: "findWhatYouLove",
        description: "discoverAmazingProducts",
        button: "exploreProducts",
        image: "/images/1.avif",
        className: "shopping-slide",
        action: "products"
    },
    {
        title: "everythingInOnePlace",
        description: "exploreCategories",
        button: "exploreCategories",
        image: "/images/2.avif",
        className: "categories-slide",
        action: "categories"
    },
    {
        title: "buySmart",
        description: "discoverAmazingProducts",
        button: "startSelling",
        image: "/images/3.avif",
        className: "selling-slide",
        action: "sell"
    }
];

const categories = [
    {
        value: "Electronics",
        names: {
            en: "Electronics",
            hy: "Էլեկտրոնիկա",
            ru: "Электроника"
        },
        image: "/images/4.avif"
    },
    {
        value: "Phones",
        names: {
            en: "Phones",
            hy: "Հեռախոսներ",
            ru: "Телефоны"
        },
        image: "/images/5.avif"
    },
    {
        value: "Computers",
        names: {
            en: "Computers",
            hy: "Համակարգիչներ",
            ru: "Компьютеры"
        },
        image: "/images/6.avif"
    },
    {
        value: "Fashion",
        names: {
            en: "Fashion",
            hy: "Նորաձևություն",
            ru: "Мода"
        },
        image: "/images/7.avif"
    },
    {
        value: "Home & Garden",
        names: {
            en: "Home & Garden",
            hy: "Տուն և այգի",
            ru: "Дом и сад"
        },
        image: "/images/8.avif"
    },
    {
        value: "Sports",
        names: {
            en: "Sports",
            hy: "Սպորտ",
            ru: "Спорт"
        },
        image: "/images/9.avif"
    },
    {
        value: "Vehicles",
        names: {
            en: "Vehicles",
            hy: "Տրանսպորտային միջոցներ",
            ru: "Транспорт"
        },
        image: "/images/10.avif"
    },
    {
        value: "Other",
        names: {
            en: "Other",
            hy: "Այլ",
            ru: "Другое"
        },
        image: "/images/11.avif"
    }
];


const accessibilityTranslations = {
    en: {
        promotions: "Marketplace promotions",
        previous: "Previous slide",
        next: "Next slide",
        goToSlide: "Go to slide",
        categories: "Shop by category"
    },
    hy: {
        promotions: "Շուկայի առաջարկներ",
        previous: "Նախորդ սլայդը",
        next: "Հաջորդ սլայդը",
        goToSlide: "Անցնել սլայդին",
        categories: "Գնումներ ըստ կատեգորիայի"
    },
    ru: {
        promotions: "Предложения торговой площадки",
        previous: "Предыдущий слайд",
        next: "Следующий слайд",
        goToSlide: "Перейти к слайду",
        categories: "Покупки по категориям"
    }
};

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const [searchParams] = useSearchParams();
    const { t, language } = useLanguage();

    const accessibility =
        accessibilityTranslations[language] || accessibilityTranslations.en;

    const search = searchParams.get("search") || "";

    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            setLoading(true);

            try {
                const data = await getProducts(search);

                if (!cancelled) {
                    setProducts(
                        Array.isArray(data) ? data : data.products || []
                    );
                }
            } catch (error) {
                console.error(error);

                if (!cancelled) {
                    setProducts([]);
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
    }, [search]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const previousSlide = () => {
        setActiveSlide(
            (current) => (current - 1 + slides.length) % slides.length
        );
    };

    const nextSlide = () => {
        setActiveSlide((current) => (current + 1) % slides.length);
    };

    const slide = slides[activeSlide];

    return (
        <div className="home-page">
            <section
                className={`home-slider ${slide.className}`}
                style={{ backgroundImage: `url("${slide.image}")` }}
                aria-label={accessibility.promotions}
            >
                <div className="home-slider-overlay" />

                <button
                    type="button"
                    className="slider-arrow slider-arrow-left"
                    onClick={previousSlide}
                    aria-label={accessibility.previous}
                >
                    &#10094;
                </button>

                <div className="home-slider-content" key={activeSlide}>
                    <span className="slider-eyebrow">MY MARKETPLACE</span>

                    <h1>{t(slide.title)}</h1>

                    <p>{t(slide.description)}</p>

                    {slide.action === "products" && (
                        <a className="slider-button" href="#products">
                            {t(slide.button)}
                        </a>
                    )}

                    {slide.action === "categories" && (
                        <Link
                            className="slider-button"
                            to="/category/Electronics"
                        >
                            {t(slide.button)}
                        </Link>
                    )}

                    {slide.action === "sell" && (
                        <Link className="slider-button" to="/create-product">
                            {t(slide.button)}
                        </Link>
                    )}
                </div>

                <button
                    type="button"
                    className="slider-arrow slider-arrow-right"
                    onClick={nextSlide}
                    aria-label={accessibility.next}
                >
                    &#10095;
                </button>

                <div className="slider-dots">
                    {slides.map((item, index) => (
                        <button
                            key={item.className}
                            type="button"
                            className={`slider-dot ${activeSlide === index ? "active" : ""
                                }`}
                            onClick={() => setActiveSlide(index)}
                            aria-label={`${accessibility.goToSlide} ${index + 1}`}
                            aria-current={
                                activeSlide === index ? "true" : undefined
                            }
                        />
                    ))}
                </div>
            </section>

            <section className="home-categories-section">
                <h2 className="home-categories-title">
                    {accessibility.categories}
                </h2>

                <div className="home-categories-list">
                    {categories.map((category) => (
                        <Link
                            key={category.value}
                            to={`/category/${encodeURIComponent(category.value)}`}
                            className="home-category-card"
                        >
                            <img
                                src={category.image}
                                alt={category.names[language] || category.names.en}
                                className="home-category-image"
                                loading="lazy"
                            />
                            <span className="home-category-name">
                                {category.names[language] || category.names.en}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="home-products-section" id="products">
                <h2 className="home-products-title">
                    {search
                        ? `${t("searchResults")}: "${search}"`
                        : t("discoverProducts")}
                </h2>

                {loading ? (
                    <p className="home-loading">
                        {t("loadingProducts")}
                    </p>
                ) : products.length === 0 ? (
                    <p className="home-empty">
                        {search
                            ? `${t("noSearchResults")} "${search}"`
                            : t("noProducts")}
                    </p>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;