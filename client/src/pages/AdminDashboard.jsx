
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import "./AdminDashboard.css";

const API_URL = "https://my-marketplace-api.onrender.com";

const currencies = {
    AMD: "֏",
    USD: "$",
    EUR: "€",
    RUB: "₽"
};

const translations = {
    en: {
        loginRequired: "Please log in with your admin account.",
        invalidSession: "Your session is invalid. Please log in again.",
        adminRequired: "Admin access is required.",
        loadFailed: "Could not load dashboard data.",
        somethingWrong: "Something went wrong.",
        deleteProductConfirm: "Are you sure you want to delete this product?",
        deleteUserConfirm: "Are you sure you want to permanently delete this user?",
        deleteProductFailed: "Could not delete product.",
        deleteUserFailed: "Could not delete user.",
        loading: "Loading dashboard...",
        management: "MANAGEMENT",
        title: "Admin Dashboard",
        subtitle: "Manage your marketplace at a glance.",
        registeredUsers: "Registered users",
        totalProducts: "Total products",
        verifiedEmails: "Verified emails",
        users: "users",
        products: "products",
        name: "Name",
        email: "Email",
        role: "Role",
        emailStatus: "Email status",
        actions: "Actions",
        verified: "Verified",
        notVerified: "Not verified",
        deleteUser: "Delete user",
        noProducts: "No products found.",
        noImage: "No image",
        seller: "Seller:",
        unknown: "Unknown",
        deleteProduct: "Delete product",
        editProduct: "Edit product",
        price: "Price",
        currency: "Currency",
        saveChanges: "Save changes",
        cancel: "Cancel",
        saving: "Saving...",
        updateSuccess: "Product updated successfully.",
        updateFailed: "Could not update product.",
        invalidPrice: "Enter a valid price greater than or equal to zero."
    },
    hy: {
        loginRequired: "Խնդրում ենք մուտք գործել ադմինիստրատորի հաշվով։",
        invalidSession: "Ձեր մուտքի ժամկետն անվավեր է։ Խնդրում ենք կրկին մուտք գործել։",
        adminRequired: "Պահանջվում են ադմինիստրատորի իրավունքներ։",
        loadFailed: "Չհաջողվեց բեռնել կառավարման վահանակի տվյալները։",
        somethingWrong: "Ինչ-որ բան սխալ է տեղի ունեցել։",
        deleteProductConfirm: "Վստա՞հ եք, որ ցանկանում եք ջնջել այս ապրանքը։",
        deleteUserConfirm: "Վստա՞հ եք, որ ցանկանում եք ընդմիշտ ջնջել այս օգտատիրոջը։",
        deleteProductFailed: "Չհաջողվեց ջնջել ապրանքը։",
        deleteUserFailed: "Չհաջողվեց ջնջել օգտատիրոջը։",
        loading: "Կառավարման վահանակը բեռնվում է...",
        management: "ԿԱՌԱՎԱՐՈՒՄ",
        title: "Ադմինիստրատորի վահանակ",
        subtitle: "Կառավարեք ձեր առևտրային հարթակը մեկ վայրից։",
        registeredUsers: "Գրանցված օգտատերեր",
        totalProducts: "Ապրանքների ընդհանուր քանակը",
        verifiedEmails: "Հաստատված էլ․ հասցեներ",
        users: "օգտատեր",
        products: "ապրանք",
        name: "Անուն",
        email: "Էլ․ հասցե",
        role: "Դեր",
        emailStatus: "Էլ․ հասցեի կարգավիճակ",
        actions: "Գործողություններ",
        verified: "Հաստատված է",
        notVerified: "Հաստատված չէ",
        deleteUser: "Ջնջել օգտատիրոջը",
        noProducts: "Ապրանքներ չեն գտնվել։",
        noImage: "Նկար չկա",
        seller: "Վաճառող՝",
        unknown: "Անհայտ",
        deleteProduct: "Ջնջել ապրանքը",
        editProduct: "Խմբագրել ապրանքը",
        price: "Գին",
        currency: "Արժույթ",
        saveChanges: "Պահպանել փոփոխությունները",
        cancel: "Չեղարկել",
        saving: "Պահպանվում է...",
        updateSuccess: "Ապրանքը հաջողությամբ թարմացվեց։",
        updateFailed: "Չհաջողվեց թարմացնել ապրանքը։",
        invalidPrice: "Մուտքագրեք զրոյից ոչ պակաս վավեր գին։"
    },
    ru: {
        loginRequired: "Войдите в аккаунт администратора.",
        invalidSession: "Ваша сессия недействительна. Войдите снова.",
        adminRequired: "Требуются права администратора.",
        loadFailed: "Не удалось загрузить данные панели управления.",
        somethingWrong: "Произошла ошибка.",
        deleteProductConfirm: "Вы уверены, что хотите удалить этот товар?",
        deleteUserConfirm: "Вы уверены, что хотите навсегда удалить этого пользователя?",
        deleteProductFailed: "Не удалось удалить товар.",
        deleteUserFailed: "Не удалось удалить пользователя.",
        loading: "Загрузка панели управления...",
        management: "УПРАВЛЕНИЕ",
        title: "Панель администратора",
        subtitle: "Управляйте маркетплейсом в одном месте.",
        registeredUsers: "Зарегистрированные пользователи",
        totalProducts: "Всего товаров",
        verifiedEmails: "Подтверждённые адреса электронной почты",
        users: "пользователей",
        products: "товаров",
        name: "Имя",
        email: "Электронная почта",
        role: "Роль",
        emailStatus: "Статус почты",
        actions: "Действия",
        verified: "Подтверждён",
        notVerified: "Не подтверждён",
        deleteUser: "Удалить пользователя",
        noProducts: "Товары не найдены.",
        noImage: "Нет изображения",
        seller: "Продавец:",
        unknown: "Неизвестно",
        deleteProduct: "Удалить товар",
        editProduct: "Редактировать товар",
        price: "Цена",
        currency: "Валюта",
        saveChanges: "Сохранить изменения",
        cancel: "Отмена",
        saving: "Сохранение...",
        updateSuccess: "Товар успешно обновлён.",
        updateFailed: "Не удалось обновить товар.",
        invalidPrice: "Введите корректную цену, равную нулю или больше."
    }
};

function AdminDashboard() {
    const { language } = useLanguage();
    const text = translations[language] || translations.en;

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingProductId, setEditingProductId] = useState(null);
    const [editPrice, setEditPrice] = useState("");
    const [editCurrency, setEditCurrency] = useState("AMD");
    const [savingProductId, setSavingProductId] = useState(null);

    useEffect(() => {
        const loadDashboard = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError(text.loginRequired);
                setLoading(false);
                return;
            }

            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [usersResponse, productsResponse] = await Promise.all([
                    fetch(`${API_URL}/admin/users`, { headers }),
                    fetch(`${API_URL}/admin/products`, { headers })
                ]);

                if (
                    usersResponse.status === 401 ||
                    productsResponse.status === 401
                ) {
                    throw new Error(text.invalidSession);
                }

                if (
                    usersResponse.status === 403 ||
                    productsResponse.status === 403
                ) {
                    throw new Error(text.adminRequired);
                }

                if (!usersResponse.ok || !productsResponse.ok) {
                    throw new Error(text.loadFailed);
                }

                const usersData = await usersResponse.json();
                const productsData = await productsResponse.json();

                setUsers(usersData);
                setProducts(productsData);
            } catch (err) {
                setError(err.message || text.somethingWrong);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleEditProduct = (product) => {
        setEditingProductId(product._id);
        setEditPrice(String(product.price ?? ""));
        setEditCurrency(product.currency || "AMD");
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
        setEditPrice("");
        setEditCurrency("AMD");
    };

    const handleSaveProduct = async (productId) => {
        const price = Number(editPrice);

        if (
            editPrice.trim() === "" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            window.alert(text.invalidPrice);
            return;
        }

        try {
            setSavingProductId(productId);

            const response = await fetch(
                `${API_URL}/admin/products/${productId}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        price,
                        currency: editCurrency
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(text.invalidSession);
                }

                if (response.status === 403) {
                    throw new Error(text.adminRequired);
                }

                throw new Error(data.message || text.updateFailed);
            }

            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product._id === productId
                        ? { ...product, ...data }
                        : product
                )
            );

            handleCancelEdit();
            window.alert(text.updateSuccess);
        } catch (err) {
            window.alert(err.message || text.updateFailed);
        } finally {
            setSavingProductId(null);
        }
    };

    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm(text.deleteProductConfirm);

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/admin/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.deleteProductFailed);
            }

            setProducts((currentProducts) =>
                currentProducts.filter((product) => product._id !== productId)
            );

            if (editingProductId === productId) {
                handleCancelEdit();
            }
        } catch (err) {
            window.alert(err.message || text.deleteProductFailed);
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm(text.deleteUserConfirm);

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.deleteUserFailed);
            }

            setUsers((currentUsers) =>
                currentUsers.filter((user) => user._id !== userId)
            );
        } catch (err) {
            window.alert(err.message || text.deleteUserFailed);
        }
    };

    const formatPrice = (product) => {
        const currency = product.currency || "AMD";
        const symbol = currencies[currency] || currencies.AMD;

        return `${symbol} ${product.price}`;
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <p>{text.loading}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <p className="admin-error">{error}</p>
            </div>
        );
    }

    return (
        <section className="admin-dashboard">
            <div className="admin-heading">
                <div>
                    <p className="admin-eyebrow">{text.management}</p>
                    <h1>{text.title}</h1>
                    <p>{text.subtitle}</p>
                </div>
            </div>

            <div className="admin-stats">
                <article className="admin-stat">
                    <span>{text.registeredUsers}</span>
                    <strong>{users.length}</strong>
                </article>

                <article className="admin-stat">
                    <span>{text.totalProducts}</span>
                    <strong>{products.length}</strong>
                </article>

                <article className="admin-stat">
                    <span>{text.verifiedEmails}</span>
                    <strong>
                        {users.filter((user) => user.isEmailVerified).length}
                    </strong>
                </article>
            </div>

            <section className="admin-section">
                <div className="admin-section-heading">
                    <h2>{text.registeredUsers}</h2>
                    <span>
                        {users.length} {text.users}
                    </span>
                </div>

                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{text.name}</th>
                                <th>{text.email}</th>
                                <th>{text.role}</th>
                                <th>{text.emailStatus}</th>
                                <th>{text.actions}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={`admin-role ${
                                                user.role === "admin"
                                                    ? "is-admin"
                                                    : ""
                                            }`}
                                        >
                                            {user.role || "user"}
                                        </span>
                                    </td>
                                    <td>
                                        {user.isEmailVerified
                                            ? text.verified
                                            : text.notVerified}
                                    </td>
                                    <td>
                                        {user._id !==
                                            localStorage.getItem("userId") &&
                                            user.role !== "admin" && (
                                                <button
                                                    className="admin-delete-button"
                                                    onClick={() =>
                                                        handleDeleteUser(user._id)
                                                    }
                                                >
                                                    {text.deleteUser}
                                                </button>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="admin-section">
                <div className="admin-section-heading">
                    <h2>{text.totalProducts}</h2>
                    <span>
                        {products.length} {text.products}
                    </span>
                </div>

                <div className="admin-products">
                    {products.length === 0 ? (
                        <p>{text.noProducts}</p>
                    ) : (
                        products.map((product) => {
                            const isEditing =
                                editingProductId === product._id;
                            const isSaving =
                                savingProductId === product._id;

                            return (
                                <article
                                    className="admin-product"
                                    key={product._id}
                                >
                                    {product.image ? (
                                        <img
                                            src={
                                                product.image.startsWith("http")
                                                    ? product.image
                                                    : `${API_URL}${product.image}`
                                            }
                                            alt={product.title}
                                        />
                                    ) : (
                                        <div className="admin-product-placeholder">
                                            {text.noImage}
                                        </div>
                                    )}

                                    <div className="admin-product-info">
                                        <h3>{product.title}</h3>
                                        <p>{product.category}</p>

                                        {!isEditing ? (
                                            <>
                                                <strong>
                                                    {formatPrice(product)}
                                                </strong>

                                                <small>
                                                    {text.seller}{" "}
                                                    {product.user?.name ||
                                                        text.unknown}
                                                </small>

                                                <button
                                                    type="button"
                                                    className="admin-edit-button"
                                                    onClick={() =>
                                                        handleEditProduct(product)
                                                    }
                                                >
                                                    {text.editProduct}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="admin-product-edit">
                                                <label
                                                    htmlFor={`price-${product._id}`}
                                                >
                                                    {text.price}
                                                </label>

                                                <input
                                                    id={`price-${product._id}`}
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    value={editPrice}
                                                    onChange={(event) =>
                                                        setEditPrice(
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isSaving}
                                                />

                                                <label
                                                    htmlFor={`currency-${product._id}`}
                                                >
                                                    {text.currency}
                                                </label>

                                                <select
                                                    id={`currency-${product._id}`}
                                                    value={editCurrency}
                                                    onChange={(event) =>
                                                        setEditCurrency(
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isSaving}
                                                >
                                                    <option value="AMD">
                                                        AMD (֏)
                                                    </option>
                                                    <option value="USD">
                                                        USD ($)
                                                    </option>
                                                    <option value="EUR">
                                                        EUR (€)
                                                    </option>
                                                    <option value="RUB">
                                                        RUB (₽)
                                                    </option>
                                                </select>

                                                <div className="admin-edit-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-edit-button"
                                                        onClick={() =>
                                                            handleSaveProduct(
                                                                product._id
                                                            )
                                                        }
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving
                                                            ? text.saving
                                                            : text.saveChanges}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-cancel-button"
                                                        onClick={handleCancelEdit}
                                                        disabled={isSaving}
                                                    >
                                                        {text.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="admin-delete-button"
                                            onClick={() =>
                                                handleDeleteProduct(product._id)
                                            }
                                        >
                                            {text.deleteProduct}
                                        </button>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </section>
        </section>
    );
}

export default AdminDashboard;