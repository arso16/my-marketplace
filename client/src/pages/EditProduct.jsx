
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./EditProduct.css";

const API = "https://my-marketplace-api.onrender.com";

const translations = {
    en: {
        title: "Edit Product",
        subtitle: "Update your product",
        productTitle: "Title",
        description: "Description",
        price: "Price",
        currency: "Currency",
        category: "Category",
        currentImage: "Current Image",
        noImage: "No image",
        chooseImage: "Choose New Image",
        newImage: "New image:",
        imageUrl: "Or use Image URL",
        imagePlaceholder: "Leave empty to keep current image",
        condition: "Condition",
        new: "New",
        used: "Used",
        save: "Save Changes",
        loginRequired: "You must log in first",
        loadFailed: "Failed to get product",
        updateFailed: "Failed to update product",
        updateSuccess: "Product updated successfully"
    },
    hy: {
        title: "Խմբագրել ապրանքը",
        subtitle: "Թարմացրեք ձեր ապրանքը",
        productTitle: "Անվանում",
        description: "Նկարագրություն",
        price: "Գին",
        currency: "Արժույթ",
        category: "Կատեգորիա",
        currentImage: "Ընթացիկ նկար",
        noImage: "Նկար չկա",
        chooseImage: "Ընտրել նոր նկար",
        newImage: "Նոր նկար՝",
        imageUrl: "Կամ օգտագործել նկարի հղում",
        imagePlaceholder: "Դատարկ թողեք՝ ընթացիկ նկարը պահպանելու համար",
        condition: "Վիճակ",
        new: "Նոր",
        used: "Օգտագործված",
        save: "Պահպանել փոփոխությունները",
        loginRequired: "Նախ պետք է մուտք գործեք",
        loadFailed: "Չհաջողվեց բեռնել ապրանքը",
        updateFailed: "Չհաջողվեց թարմացնել ապրանքը",
        updateSuccess: "Ապրանքը հաջողությամբ թարմացվեց"
    },
    ru: {
        title: "Редактировать товар",
        subtitle: "Обновите информацию о товаре",
        productTitle: "Название",
        description: "Описание",
        price: "Цена",
        currency: "Валюта",
        category: "Категория",
        currentImage: "Текущее изображение",
        noImage: "Нет изображения",
        chooseImage: "Выбрать новое изображение",
        newImage: "Новое изображение:",
        imageUrl: "Или использовать ссылку на изображение",
        imagePlaceholder: "Оставьте пустым, чтобы сохранить текущее изображение",
        condition: "Состояние",
        new: "Новый",
        used: "Бывший в употреблении",
        save: "Сохранить изменения",
        loginRequired: "Сначала войдите в аккаунт",
        loadFailed: "Не удалось загрузить товар",
        updateFailed: "Не удалось обновить товар",
        updateSuccess: "Товар успешно обновлён"
    }
};

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const text = translations[language] || translations.en;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("AMD");
    const [category, setCategory] = useState("");
    const [condition, setCondition] = useState("new");

    const [currentImage, setCurrentImage] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await fetch(`${API}/products/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || text.loadFailed);
                }

                setTitle(data.title || "");
                setDescription(data.description || "");
                setPrice(data.price ?? "");
                setCurrency(data.currency || "AMD");
                setCategory(data.category || "");
                setCondition(data.condition || "new");
                setCurrentImage(data.image || "");
            } catch (err) {
                console.log(err);
                window.alert(err.message || text.loadFailed);
            }
        };

        loadProduct();
    }, [id]);

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `${API}${image}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            window.alert(text.loginRequired);
            navigate("/login");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", Number(price));
            formData.append("currency", currency);
            formData.append("category", category);
            formData.append("condition", condition);

            if (newImage) {
                formData.append("image", newImage);
            } else if (imageUrl.trim()) {
                formData.append("image", imageUrl.trim());
            } else {
                formData.append("image", currentImage);
            }

            const response = await fetch(`${API}/products/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.updateFailed);
            }

            window.alert(text.updateSuccess);
            navigate("/");
        } catch (err) {
            console.log(err);
            window.alert(err.message || text.updateFailed);
        }
    };

    return (
        <div className="edit-product-page">
            <div className="edit-product-box">
                <h1>{text.title}</h1>

                <p className="edit-product-subtitle">
                    {text.subtitle}
                </p>

                <form onSubmit={handleSubmit}>
                    <label>{text.productTitle}</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>{text.description}</label>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label>{text.price}</label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />

                    <label>{text.currency}</label>

                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                    >
                        <option value="AMD">AMD ֏</option>
                        <option value="USD">USD $</option>
                        <option value="EUR">EUR €</option>
                        <option value="RUB">RUB ₽</option>
                    </select>

                    <label>{text.category}</label>

                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />

                    <label>{text.currentImage}</label>

                    {currentImage ? (
                        <img
                            src={getImageUrl(currentImage)}
                            alt={title}
                            className="edit-product-image"
                        />
                    ) : (
                        <p>{text.noImage}</p>
                    )}

                    <label>{text.chooseImage}</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setNewImage(e.target.files[0] || null);
                            setImageUrl("");
                        }}
                    />

                    {newImage && (
                        <p>
                            {text.newImage} {newImage.name}
                        </p>
                    )}

                    <label>{text.imageUrl}</label>

                    <input
                        type="text"
                        placeholder={text.imagePlaceholder}
                        value={imageUrl}
                        onChange={(e) => {
                            setImageUrl(e.target.value);

                            if (e.target.value.trim()) {
                                setNewImage(null);
                            }
                        }}
                    />

                    <label>{text.condition}</label>

                    <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    >
                        <option value="new">{text.new}</option>
                        <option value="used">{text.used}</option>
                    </select>

                    <button type="submit">
                        {text.save}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProduct;