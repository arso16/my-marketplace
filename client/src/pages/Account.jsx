
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./Account.css";

const translations = {
    en: {
        loading: "Loading...",
        account: "My Account",
        profile: "Profile",
        user: "User",
        noEmail: "No email",
        favorites: "My Favorites",
        noFavorites: "You haven't saved any favorites yet.",
        favoriteHint: "Tap the heart on a product to save it here.",
        browse: "Browse Products",
        noImage: "No Image",
        condition: "Condition",
        view: "View",
        remove: "Remove",
        listings: "My Listings",
        sellProduct: "+ Sell Product",
        noListings: "You don't have any listings yet.",
        sellingHint: "Start selling something on the marketplace.",
        createListing: "Create Listing",
        edit: "Edit",
        delete: "Delete",
        settings: "Account Settings",
        changePassword: "Change Password",
        logout: "Logout",
        confirmDelete: "Are you sure you want to delete this product?",
        deleteFailed: "Failed to delete product",
        deleteSuccess: "Product deleted successfully",
        removeFailed: "Failed to remove favorite",
        sellerContact: "Seller Contact Details",
        contactHint: "Add at least one way for buyers to contact you. These details will be visible publicly on your seller profile.",
        phone: "Phone number",
        instagram: "Instagram username or profile URL",
        facebook: "Facebook profile URL",
        saveContact: "Save Contact Details",
        saving: "Saving...",
        contactSaved: "Contact details saved successfully.",
        contactFailed: "Failed to save contact details.",
        contactRequired: "Enter at least one contact method.",
        publicProfile: "View My Public Seller Profile",
        phonePlaceholder: "+374...",
        instagramPlaceholder: "@username or Instagram profile URL",
        facebookPlaceholder: "https://www.facebook.com/your-profile",
        price: "Price",
        moreTitle: "Contact method added!",
        moreQuestion: "Would you like to add another contact method?",
        yesMore: "Yes, add another",
        done: "No, I'm done",
        allDone: "Your contact details are saved. You're all set!",
        switchAccounts: "Switch Accounts",
        switchHint: "Choose a saved account or add another account.",
        currentAccount: "Current account",
        switch: "Switch",
        addAccount: "Add another account",
        removeAccount: "Remove",
        confirmRemoveAccount: "Remove this saved account from this device?",
        noSavedAccounts: "No saved accounts yet. Log in to another account to save it here.",
        accountRemoved: "Saved account removed.",
        logoutAll: "Log out of all accounts"
    },
    hy: {
        loading: "Բեռնվում է...",
        account: "Իմ հաշիվը",
        profile: "Անձնական տվյալներ",
        user: "Օգտատեր",
        noEmail: "Էլ․ փոստ չկա",
        favorites: "Իմ նախընտրածները",
        noFavorites: "Դուք դեռ նախընտրած ապրանքներ չունեք։",
        favoriteHint: "Սեղմեք ապրանքի սրտիկը՝ այն այստեղ պահելու համար։",
        browse: "Դիտել ապրանքները",
        noImage: "Նկար չկա",
        condition: "Վիճակ",
        view: "Դիտել",
        remove: "Հեռացնել",
        listings: "Իմ հայտարարությունները",
        sellProduct: "+ Վաճառել ապրանք",
        noListings: "Դուք դեռ հայտարարություններ չունեք։",
        sellingHint: "Սկսեք ինչ-որ բան վաճառել հարթակում։",
        createListing: "Ստեղծել հայտարարություն",
        edit: "Խմբագրել",
        delete: "Ջնջել",
        settings: "Հաշվի կարգավորումներ",
        changePassword: "Փոխել գաղտնաբառը",
        logout: "Դուրս գալ",
        confirmDelete: "Վստա՞հ եք, որ ցանկանում եք ջնջել այս ապրանքը։",
        deleteFailed: "Չհաջողվեց ջնջել ապրանքը",
        deleteSuccess: "Ապրանքը հաջողությամբ ջնջվեց",
        removeFailed: "Չհաջողվեց հեռացնել նախընտրածներից",
        sellerContact: "Վաճառողի կոնտակտային տվյալներ",
        contactHint: "Ավելացրեք գնորդների հետ կապվելու առնվազն մեկ եղանակ։ Այս տվյալները տեսանելի կլինեն ձեր հանրային վաճառողի էջում։",
        phone: "Հեռախոսահամար",
        instagram: "Instagram օգտանուն կամ էջի հղում",
        facebook: "Facebook էջի հղում",
        saveContact: "Պահպանել տվյալները",
        saving: "Պահպանվում է...",
        contactSaved: "Կոնտակտային տվյալները հաջողությամբ պահպանվեցին։",
        contactFailed: "Չհաջողվեց պահպանել կոնտակտային տվյալները։",
        contactRequired: "Մուտքագրեք կապի առնվազն մեկ եղանակ։",
        publicProfile: "Դիտել իմ հանրային վաճառողի էջը",
        phonePlaceholder: "+374...",
        instagramPlaceholder: "@username կամ Instagram էջի հղում",
        facebookPlaceholder: "https://www.facebook.com/your-profile",
        price: "Գին",
        moreTitle: "Կոնտակտային եղանակն ավելացվեց։",
        moreQuestion: "Ցանկանո՞ւմ եք ավելացնել կապի ևս մեկ եղանակ։",
        yesMore: "Այո, ավելացնել",
        done: "Ոչ, ավարտել",
        allDone: "Ձեր տվյալները պահպանված են։ Պատրաստ է։",
        switchAccounts: "Փոխել հաշիվը",
        switchHint: "Ընտրեք պահպանված հաշիվը կամ ավելացրեք մեկ այլ հաշիվ։",
        currentAccount: "Ընթացիկ հաշիվ",
        switch: "Փոխել",
        addAccount: "Ավելացնել այլ հաշիվ",
        removeAccount: "Հեռացնել",
        confirmRemoveAccount: "Հեռացնե՞լ պահպանված հաշիվը այս սարքից։",
        noSavedAccounts: "Պահպանված հաշիվներ դեռ չկան։ Մուտք գործեք մեկ այլ հաշիվ՝ այն այստեղ պահպանելու համար։",
        accountRemoved: "Պահպանված հաշիվը հեռացվեց։",
        logoutAll: "Դուրս գալ բոլոր հաշիվներից"
    },
    ru: {
        loading: "Загрузка...",
        account: "Мой аккаунт",
        profile: "Профиль",
        user: "Пользователь",
        noEmail: "Нет электронной почты",
        favorites: "Избранное",
        noFavorites: "Вы ещё не добавили товары в избранное.",
        favoriteHint: "Нажмите на сердечко товара, чтобы сохранить его здесь.",
        browse: "Просмотреть товары",
        noImage: "Нет изображения",
        condition: "Состояние",
        view: "Посмотреть",
        remove: "Убрать",
        listings: "Мои объявления",
        sellProduct: "+ Продать товар",
        noListings: "У вас пока нет объявлений.",
        sellingHint: "Начните продавать товары на площадке.",
        createListing: "Создать объявление",
        edit: "Изменить",
        delete: "Удалить",
        settings: "Настройки аккаунта",
        changePassword: "Изменить пароль",
        logout: "Выйти",
        confirmDelete: "Вы уверены, что хотите удалить этот товар?",
        deleteFailed: "Не удалось удалить товар",
        deleteSuccess: "Товар успешно удалён",
        removeFailed: "Не удалось убрать товар из избранного",
        sellerContact: "Контактные данные продавца",
        contactHint: "Добавьте хотя бы один способ связи с покупателями. Эти данные будут видны в вашем публичном профиле продавца.",
        phone: "Номер телефона",
        instagram: "Имя пользователя Instagram или ссылка",
        facebook: "Ссылка на профиль Facebook",
        saveContact: "Сохранить контакты",
        saving: "Сохранение...",
        contactSaved: "Контактные данные успешно сохранены.",
        contactFailed: "Не удалось сохранить контактные данные.",
        contactRequired: "Укажите хотя бы один способ связи.",
        publicProfile: "Посмотреть мой публичный профиль продавца",
        phonePlaceholder: "+374...",
        instagramPlaceholder: "@username или ссылка Instagram",
        facebookPlaceholder: "https://www.facebook.com/your-profile",
        price: "Цена",
        moreTitle: "Способ связи добавлен!",
        moreQuestion: "Хотите добавить ещё один способ связи?",
        yesMore: "Да, добавить ещё",
        done: "Нет, закончить",
        allDone: "Контактные данные сохранены. Всё готово!",
        switchAccounts: "Смена аккаунта",
        switchHint: "Выберите сохранённый аккаунт или добавьте другой.",
        currentAccount: "Текущий аккаунт",
        switch: "Переключить",
        addAccount: "Добавить аккаунт",
        removeAccount: "Удалить",
        confirmRemoveAccount: "Удалить сохранённый аккаунт с этого устройства?",
        noSavedAccounts: "Сохранённых аккаунтов пока нет. Войдите в другой аккаунт, чтобы сохранить его здесь.",
        accountRemoved: "Сохранённый аккаунт удалён.",
        logoutAll: "Выйти из всех аккаунтов"
    }
};

function readSavedAccounts() {
    try {
        const parsed = JSON.parse(
            localStorage.getItem("savedAccounts") || "[]"
        );

        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (account) =>
                account &&
                typeof account.id === "string" &&
                typeof account.token === "string" &&
                typeof account.email === "string"
        );
    } catch {
        return [];
    }
}

function getTokenUserId(token) {
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        return String(
            payload.userId ||
            payload.id ||
            payload._id ||
            payload.sub ||
            ""
        );
    } catch {
        return "";
    }
}

function Account() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const text = translations[language] || translations.en;

    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");
    const [savingContact, setSavingContact] = useState(false);
    const [contactMessage, setContactMessage] = useState("");
    const [contactError, setContactError] = useState(false);
    const [showMoreContacts, setShowMoreContacts] = useState(false);
    const [contactFormDone, setContactFormDone] = useState(false);

    const [savedAccounts, setSavedAccounts] = useState(readSavedAccounts);
    const [activeAccountId, setActiveAccountId] = useState(
        localStorage.getItem("activeAccountId") || ""
    );
    const [accountMessage, setAccountMessage] = useState("");

    const token = localStorage.getItem("token");
    const userId = token ? getTokenUserId(token) : "";

    useEffect(() => {
        setSavedAccounts(readSavedAccounts());
        setActiveAccountId(
            localStorage.getItem("activeAccountId") || ""
        );
    }, []);

    useEffect(() => {
        const loadAccount = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [userResponse, productsResponse, favoritesResponse] =
                    await Promise.all([
                        fetch("https://my-marketplace-api.onrender.com/users/me", { headers }),
                        fetch("https://my-marketplace-api.onrender.com/products?limit=100"),
                        fetch("https://my-marketplace-api.onrender.com/users/favorites", { headers })
                    ]);

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                    setPhoneNumber(userData.phoneNumber || "");
                    setInstagram(userData.instagram || "");
                    setFacebook(userData.facebook || "");

                    const actualId = String(
                        userData._id || userData.id || ""
                    );

                    if (actualId) {
                        setActiveAccountId(actualId);
                        localStorage.setItem("activeAccountId", actualId);

                        const existing = readSavedAccounts();
                        const matchingAccount = existing.find(
                            (account) => account.id === actualId
                        );

                        if (matchingAccount) {
                            const refreshed = existing.map((account) =>
                                account.id === actualId
                                    ? {
                                        ...account,
                                        token,
                                        email: userData.email || account.email,
                                        name: userData.name || account.name
                                    }
                                    : account
                            );

                            localStorage.setItem(
                                "savedAccounts",
                                JSON.stringify(refreshed)
                            );
                            setSavedAccounts(refreshed);
                        }
                    }
                }

                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    const allProducts = productsData.products || [];

                    setProducts(
                        allProducts.filter((product) => {
                            const productUserId = product.user?._id || product.user;
                            return (
                                productUserId &&
                                userId &&
                                String(productUserId) === String(userId)
                            );
                        })
                    );
                }

                if (favoritesResponse.ok) {
                    const favoritesData = await favoritesResponse.json();
                    setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token && userId) {
            loadAccount();
        } else {
            navigate("/login");
        }
    }, [token, userId, navigate]);

    const handleSwitchAccount = (account) => {
        if (!account?.token) return;

        localStorage.setItem("token", account.token);
        localStorage.setItem("activeAccountId", account.id);

        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
        window.location.reload();
    };

    const handleRemoveSavedAccount = (accountId) => {
        if (!window.confirm(text.confirmRemoveAccount)) return;

        const remaining = savedAccounts.filter(
            (account) => account.id !== accountId
        );

        localStorage.setItem("savedAccounts", JSON.stringify(remaining));
        setSavedAccounts(remaining);
        setAccountMessage(text.accountRemoved);

        if (accountId === activeAccountId) {
            localStorage.removeItem("token");
            localStorage.removeItem("activeAccountId");
            window.dispatchEvent(new Event("authChanged"));
            navigate("/login");
        }
    };

    const handleAddAccount = () => {
        navigate("/login?addAccount=true");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("activeAccountId");
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
        window.location.reload();
    };

    const handleLogoutAll = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("activeAccountId");
        localStorage.removeItem("savedAccounts");
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
        window.location.reload();
    };

    const handleSaveContact = async (event) => {
        event.preventDefault();

        setContactMessage("");
        setContactError(false);
        setShowMoreContacts(false);
        setContactFormDone(false);

        if (!phoneNumber.trim() && !instagram.trim() && !facebook.trim()) {
            setContactError(true);
            setContactMessage(text.contactRequired);
            return;
        }

        setSavingContact(true);

        try {
            const response = await fetch(
                "https://my-marketplace-api.onrender.com/users/seller/contact",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        phoneNumber,
                        instagram,
                        facebook
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.contactFailed);
            }

            if (data.user) {
                setUser((currentUser) => ({
                    ...currentUser,
                    ...data.user
                }));
                setPhoneNumber(data.user.phoneNumber || "");
                setInstagram(data.user.instagram || "");
                setFacebook(data.user.facebook || "");
            }

            setContactMessage(text.contactSaved);
            setShowMoreContacts(true);
        } catch (err) {
            setContactError(true);
            setContactMessage(err.message || text.contactFailed);
        } finally {
            setSavingContact(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm(text.confirmDelete)) return;

        try {
            const response = await fetch(
                `https://my-marketplace-api.onrender.com/products/${productId}`,
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

            setProducts((current) =>
                current.filter((product) => product._id !== productId)
            );
            setFavorites((current) =>
                current.filter((product) => product._id !== productId)
            );

            window.alert(text.deleteSuccess);
        } catch (err) {
            window.alert(err.message);
        }
    };

    const handleRemoveFavorite = async (productId) => {
        try {
            const response = await fetch(
                `https://my-marketplace-api.onrender.com/users/favorites/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.removeFailed);
            }

            setFavorites((current) =>
                current.filter((product) => product._id !== productId)
            );
        } catch (err) {
            window.alert(err.message);
        }
    };

    const getImageUrl = (product) => {
        if (!product.image) return null;

        return product.image.startsWith("http")
            ? product.image
            : `https://my-marketplace-api.onrender.com${product.image}`;
    };

    const formatPrice = (product) => {
        const symbols = {
            AMD: "֏",
            USD: "$",
            EUR: "€",
            RUB: "₽"
        };

        return `${symbols[product.currency] || "$"}${product.price}`;
    };

    if (loading) {
        return (
            <div className="account-page">
                <h1>{text.loading}</h1>
            </div>
        );
    }

    const renderProduct = (product, isFavorite = false) => {
        const imageUrl = getImageUrl(product);

        return (
            <div className="account-product" key={product._id}>
                <div
                    className="account-product-main"
                    onClick={() => navigate(`/products/${product._id}`)}
                >
                    {imageUrl ? (
                        <img src={imageUrl} alt={product.title} />
                    ) : (
                        <div className="account-no-image">{text.noImage}</div>
                    )}

                    <div className="account-product-info">
                        <h3>{product.title}</h3>
                        <p className="account-price">{formatPrice(product)}</p>
                        <p>{text.condition}: {product.condition}</p>
                    </div>
                </div>

                <div className="account-product-actions">
                    {isFavorite ? (
                        <>
                            <button
                                className="account-edit-button"
                                onClick={() => navigate(`/products/${product._id}`)}
                            >
                                {text.view}
                            </button>
                            <button
                                className="account-delete-button"
                                onClick={() => handleRemoveFavorite(product._id)}
                            >
                                {text.remove}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="account-edit-button"
                                onClick={() => navigate(`/edit-product/${product._id}`)}
                            >
                                {text.edit}
                            </button>
                            <button
                                className="account-delete-button"
                                onClick={() => handleDelete(product._id)}
                            >
                                {text.delete}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="account-page">
            <div className="account-container">
                <h1>{text.account}</h1>

                <section className="account-section">
                    <div className="section-header">
                        <h2>{text.profile}</h2>
                    </div>

                    <div className="profile-info">
                        <img
                            className="profile-avatar"
                            src={
                                user?.profilePicture ||
                                (user?.gender === "female"
                                    ? "/avatars/female.png"
                                    : "/avatars/male.png")
                            }
                            alt={`${user?.name || text.user}'s profile`}
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = "/avatars/male.png";
                            }}
                        />
                        <div>
                            <h3>{user?.name || text.user}</h3>
                            <p>{user?.email || text.noEmail}</p>
                        </div>
                    </div>
                </section>

                <section className="account-section switch-accounts-section">
                    <div className="section-header">
                        <h2>{text.switchAccounts}</h2>
                    </div>

                    <p>{text.switchHint}</p>

                    {savedAccounts.length === 0 ? (
                        <p>{text.noSavedAccounts}</p>
                    ) : (
                        <div className="account-switch-list">
                            {savedAccounts.map((account) => {
                                const isCurrent =
                                    account.id === activeAccountId ||
                                    account.id === userId;

                                return (
                                    <div
                                        className="account-switch-item"
                                        key={account.id}
                                    >
                                        <div className="account-switch-details">
                                            <span className="account-switch-avatar">
                                                {(account.name || account.email || "?")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            <div>
                                                <strong>
                                                    {account.name || account.email}
                                                </strong>
                                                <p>{account.email}</p>
                                                {isCurrent && (
                                                    <small>{text.currentAccount}</small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="account-switch-actions">
                                            {!isCurrent && (
                                                <button
                                                    type="button"
                                                    className="account-switch-button"
                                                    onClick={() =>
                                                        handleSwitchAccount(account)
                                                    }
                                                >
                                                    {text.switch}
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="account-remove-button"
                                                onClick={() =>
                                                    handleRemoveSavedAccount(account.id)
                                                }
                                            >
                                                {text.removeAccount}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {accountMessage && (
                        <p className="account-switch-message" role="status">
                            {accountMessage}
                        </p>
                    )}

                    <div className="account-switch-bottom-actions">
                        <button
                            type="button"
                            className="account-add-button"
                            onClick={handleAddAccount}
                        >
                            + {text.addAccount}
                        </button>

                        <button
                            type="button"
                            className="account-logout-all-button"
                            onClick={handleLogoutAll}
                        >
                            {text.logoutAll}
                        </button>
                    </div>
                </section>

                <section className="account-section seller-contact-section">
                    <div className="section-header">
                        <h2>{text.sellerContact}</h2>
                    </div>

                    <p className="seller-contact-hint">{text.contactHint}</p>

                    <form
                        className="seller-contact-form"
                        onSubmit={handleSaveContact}
                    >
                        <label htmlFor="seller-phone">{text.phone}</label>
                        <input
                            id="seller-phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder={text.phonePlaceholder}
                            value={phoneNumber}
                            onChange={(event) => setPhoneNumber(event.target.value)}
                        />

                        <label htmlFor="seller-instagram">{text.instagram}</label>
                        <input
                            id="seller-instagram"
                            type="text"
                            placeholder={text.instagramPlaceholder}
                            value={instagram}
                            onChange={(event) => setInstagram(event.target.value)}
                        />

                        <label htmlFor="seller-facebook">{text.facebook}</label>
                        <input
                            id="seller-facebook"
                            type="url"
                            placeholder={text.facebookPlaceholder}
                            value={facebook}
                            onChange={(event) => setFacebook(event.target.value)}
                        />

                        <button
                            className="sell-button seller-save-button"
                            type="submit"
                            disabled={savingContact}
                        >
                            {savingContact ? text.saving : text.saveContact}
                        </button>

                        {contactMessage && (
                            <p
                                className={`seller-contact-message ${
                                    contactError ? "error" : "success"
                                }`}
                                role="status"
                            >
                                {contactMessage}
                            </p>
                        )}
                    </form>

                    {showMoreContacts && (
                        <div className="more-contacts-prompt">
                            <div className="contact-prompt-icon" aria-hidden="true">
                                ✓
                            </div>
                            <h3>{text.moreTitle}</h3>
                            <p>{text.moreQuestion}</p>

                            <div className="more-contacts-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMoreContacts(false);
                                        setContactFormDone(false);
                                        setContactMessage("");
                                    }}
                                >
                                    {text.yesMore}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMoreContacts(false);
                                        setContactFormDone(true);
                                        setContactMessage("");
                                    }}
                                >
                                    {text.done}
                                </button>
                            </div>
                        </div>
                    )}

                    {contactFormDone && (
                        <p className="contacts-done-message" role="status">
                            {text.allDone}
                        </p>
                    )}

                    {userId && (
                        <button
                            className="seller-public-profile-button"
                            type="button"
                            onClick={() => navigate(`/sellers/${userId}`)}
                        >
                            {text.publicProfile}
                        </button>
                    )}
                </section>

                <section className="account-section">
                    <div className="section-header">
                        <h2>{text.favorites}</h2>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="empty-products">
                            <h3>{text.noFavorites}</h3>
                            <p>{text.favoriteHint}</p>
                            <button onClick={() => navigate("/")}>
                                {text.browse}
                            </button>
                        </div>
                    ) : (
                        <div className="account-products">
                            {favorites.map((product) => renderProduct(product, true))}
                        </div>
                    )}
                </section>

                <section className="account-section">
                    <div className="section-header">
                        <h2>{text.listings}</h2>
                        <button
                            className="sell-button"
                            onClick={() => navigate("/create-product")}
                        >
                            {text.sellProduct}
                        </button>
                    </div>

                    {products.length === 0 ? (
                        <div className="empty-products">
                            <h3>{text.noListings}</h3>
                            <p>{text.sellingHint}</p>
                            <button onClick={() => navigate("/create-product")}>
                                {text.createListing}
                            </button>
                        </div>
                    ) : (
                        <div className="account-products">
                            {products.map((product) => renderProduct(product))}
                        </div>
                    )}
                </section>

                <section className="account-section">
                    <h2>{text.settings}</h2>
                    <div className="account-settings">
                        <button onClick={() => navigate("/forgot-password")}>
                            {text.changePassword}
                        </button>
                        <button
                            className="settings-logout"
                            onClick={handleLogout}
                        >
                            {text.logout}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Account;