
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./CreateProduct.css";

const categories = [
    "Electronics",
    "Phones",
    "Computers",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Vehicles",
    "Other"
];

const translations = {
    en: {
        title: "Create Product",
        subtitle: "Add a new product to your marketplace",
        productTitle: "Title",
        titlePlaceholder: "Enter product title",
        description: "Description",
        descriptionPlaceholder: "Enter product description",
        price: "Price",
        pricePlaceholder: "Enter price",
        category: "Category",
        selectCategory: "Select a category",
        customCategory: "Custom Category",
        customCategoryPlaceholder: "Enter your category",
        chooseImage: "Choose Image",
        imageUrl: "Or use Image URL",
        imageUrlPlaceholder: "Paste image URL",
        selected: "Selected:",
        condition: "Condition",
        new: "New",
        used: "Used",
        submit: "Create Product",
        loginRequired: "You must log in first",
        categoryRequired: "Please select or enter a category",
        imageRequired: "Please choose an image or enter an image URL",
        createFailed: "Failed to create product",
        createSuccess: "Product created successfully"
    },
    hy: {
        title: "Ստեղծել ապրանք",
        subtitle: "Ավելացրեք նոր ապրանք ձեր առևտրային հարթակում",
        productTitle: "Անվանում",
        titlePlaceholder: "Մուտքագրեք ապրանքի անվանումը",
        description: "Նկարագրություն",
        descriptionPlaceholder: "Մուտքագրեք ապրանքի նկարագրությունը",
        price: "Գին",
        pricePlaceholder: "Մուտքագրեք գինը",
        category: "Կատեգորիա",
        selectCategory: "Ընտրեք կատեգորիան",
        customCategory: "Այլ կատեգորիա",
        customCategoryPlaceholder: "Մուտքագրեք կատեգորիան",
        chooseImage: "Ընտրել նկար",
        imageUrl: "Կամ օգտագործել նկարի հղում",
        imageUrlPlaceholder: "Տեղադրեք նկարի հղումը",
        selected: "Ընտրված է՝",
        condition: "Վիճակ",
        new: "Նոր",
        used: "Օգտագործված",
        submit: "Ստեղծել ապրանք",
        loginRequired: "Նախ պետք է մուտք գործեք",
        categoryRequired: "Խնդրում ենք ընտրել կամ մուտքագրել կատեգորիա",
        imageRequired: "Խնդրում ենք ընտրել նկար կամ մուտքագրել նկարի հղում",
        createFailed: "Չհաջողվեց ստեղծել ապրանքը",
        createSuccess: "Ապրանքը հաջողությամբ ստեղծվեց"
    },
    ru: {
        title: "Создать товар",
        subtitle: "Добавьте новый товар на торговую площадку",
        productTitle: "Название",
        titlePlaceholder: "Введите название товара",
        description: "Описание",
        descriptionPlaceholder: "Введите описание товара",
        price: "Цена",
        pricePlaceholder: "Введите цену",
        category: "Категория",
        selectCategory: "Выберите категорию",
        customCategory: "Своя категория",
        customCategoryPlaceholder: "Введите категорию",
        chooseImage: "Выбрать изображение",
        imageUrl: "Или использовать ссылку на изображение",
        imageUrlPlaceholder: "Вставьте ссылку на изображение",
        selected: "Выбрано:",
        condition: "Состояние",
        new: "Новый",
        used: "Бывший в употреблении",
        submit: "Создать товар",
        loginRequired: "Сначала войдите в аккаунт",
        categoryRequired: "Выберите или введите категорию",
        imageRequired: "Выберите изображение или укажите ссылку на него",
        createFailed: "Не удалось создать товар",
        createSuccess: "Товар успешно создан"
    }
};

const categoryTranslations = {
    hy: {
        Electronics: "Էլեկտրոնիկա",
        Phones: "Հեռախոսներ",
        Computers: "Համակարգիչներ",
        Fashion: "Նորաձևություն",
        "Home & Garden": "Տուն և այգի",
        Sports: "Սպորտ",
        Vehicles: "Տրանսպորտ",
        Other: "Այլ"
    },
    ru: {
        Electronics: "Электроника",
        Phones: "Телефоны",
        Computers: "Компьютеры",
        Fashion: "Мода",
        "Home & Garden": "Дом и сад",
        Sports: "Спорт",
        Vehicles: "Транспорт",
        Other: "Другое"
    }
};

function CreateProduct() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const text = translations[language] || translations.en;
    const translatedCategories = categoryTranslations[language] || {};

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("AMD");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [condition, setCondition] = useState("new");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const finalCategory =
        category === "Other" ? customCategory.trim() : category;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            window.alert(text.loginRequired);
            navigate("/login");
            return;
        }

        if (!finalCategory) {
            window.alert(text.categoryRequired);
            return;
        }

        if (!image && !imageUrl.trim()) {
            window.alert(text.imageRequired);
            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", Number(price));
            formData.append("currency", currency);
            formData.append("category", finalCategory);
            formData.append("condition", condition);

            if (image) {
                formData.append("image", image);
            } else {
                formData.append("image", imageUrl.trim());
            }

            const response = await fetch("https://my-marketplace-api.onrender.com/products", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.createFailed);
            }

            window.alert(text.createSuccess);
            navigate("/");
        } catch (err) {
            console.log(err);
            window.alert(err.message);
        }
    };

    return (
        <div className="create-product-page">
            <div className="create-product-box">
                <h1>{text.title}</h1>

                <p className="create-product-subtitle">
                    {text.subtitle}
                </p>

                <form onSubmit={handleSubmit}>
                    <label>{text.productTitle}</label>
                    <input
                        type="text"
                        placeholder={text.titlePlaceholder}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>{text.description}</label>
                    <textarea
                        placeholder={text.descriptionPlaceholder}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label>{text.price}</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder={text.pricePlaceholder}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />


                    <label htmlFor="currency">Currency</label>
                    <select
                        id="currency"
                        name="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                    >
                        <option value="AMD">AMD (֏) — Armenian Dram</option>
                        <option value="USD">USD ($) — US Dollar</option>
                        <option value="EUR">EUR (€) — Euro</option>
                        <option value="RUB">RUB (₽) — Russian Ruble</option>
                    </select>

                    <label>{text.category}</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCustomCategory("");
                        }}
                        required
                    >
                        <option value="">{text.selectCategory}</option>
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {translatedCategories[item] || item}
                            </option>
                        ))}
                    </select>

                    {category === "Other" && (
                        <>
                            <label>{text.customCategory}</label>
                            <input
                                type="text"
                                placeholder={text.customCategoryPlaceholder}
                                value={customCategory}
                                onChange={(e) =>
                                    setCustomCategory(e.target.value)
                                }
                                required
                            />
                        </>
                    )}

                    <label>{text.chooseImage}</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setImage(e.target.files[0] || null);
                            setImageUrl("");
                        }}
                        required={!imageUrl.trim()}
                    />

                    <label>{text.imageUrl}</label>
                    <input
                        type="url"
                        placeholder={text.imageUrlPlaceholder}
                        value={imageUrl}
                        onChange={(e) => {
                            setImageUrl(e.target.value);
                            if (e.target.value.trim()) {
                                setImage(null);
                            }
                        }}
                        required={!image}
                    />

                    {image && (
                        <p>{text.selected} {image.name}</p>
                    )}

                    <label>{text.condition}</label>
                    <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    >
                        <option value="new">{text.new}</option>
                        <option value="used">{text.used}</option>
                    </select>

                    <button type="submit">
                        {text.submit}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProduct;