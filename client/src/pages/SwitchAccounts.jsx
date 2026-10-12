
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./SwitchAccounts.css";

const translations = {
    en: {
        title: "Switch accounts",
        description: "Choose an account to continue.",
        current: "Current account",
        switch: "Switch",
        remove: "Remove",
        add: "Add another account",
        back: "Back to marketplace",
        confirmRemove: "Remove this saved account from this device?",
        noAccounts: "No saved accounts yet.",
        invalid: "This saved session is no longer valid. Please log in again.",
        name: "Account"
    },
    hy: {
        title: "Փոխել հաշիվը",
        description: "Ընտրեք հաշիվը շարունակելու համար։",
        current: "Ընթացիկ հաշիվ",
        switch: "Փոխել",
        remove: "Հեռացնել",
        add: "Ավելացնել այլ հաշիվ",
        back: "Վերադառնալ շուկա",
        confirmRemove: "Հեռացնե՞լ այս պահպանված հաշիվը սարքից։",
        noAccounts: "Պահպանված հաշիվներ դեռ չկան։",
        invalid: "Այս սեսիան այլևս վավեր չէ։ Խնդրում ենք կրկին մուտք գործել։",
        name: "Հաշիվ"
    },
    ru: {
        title: "Смена аккаунта",
        description: "Выберите аккаунт, чтобы продолжить.",
        current: "Текущий аккаунт",
        switch: "Переключить",
        remove: "Удалить",
        add: "Добавить аккаунт",
        back: "Вернуться на маркетплейс",
        confirmRemove: "Удалить сохранённый аккаунт с этого устройства?",
        noAccounts: "Сохранённых аккаунтов пока нет.",
        invalid: "Сессия больше недействительна. Войдите снова.",
        name: "Аккаунт"
    }
};

function readAccounts() {
    try {
        const accounts = JSON.parse(
            localStorage.getItem("savedAccounts") || "[]"
        );

        if (!Array.isArray(accounts)) return [];

        return accounts.filter(
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

function SwitchAccounts() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const text = translations[language] || translations.en;

    const [accounts, setAccounts] = useState([]);
    const [activeId, setActiveId] = useState(
        localStorage.getItem("activeAccountId") || ""
    );

    useEffect(() => {
        setAccounts(readAccounts());
    }, []);

    const switchAccount = (account) => {
        if (!account.token) return;

        localStorage.setItem("token", account.token);
        localStorage.setItem("activeAccountId", account.id);

        setActiveId(account.id);

        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
    };

    const removeAccount = (accountId) => {
        if (!window.confirm(text.confirmRemove)) return;

        const remaining = accounts.filter(
            (account) => account.id !== accountId
        );

        localStorage.setItem(
            "savedAccounts",
            JSON.stringify(remaining)
        );

        setAccounts(remaining);

        if (accountId === activeId) {
            localStorage.removeItem("token");
            localStorage.removeItem("activeAccountId");
            setActiveId("");

            window.dispatchEvent(new Event("authChanged"));
            navigate("/login");
        }
    };

    return (
        <main className="switch-accounts-page">
            <section className="switch-accounts-panel">
                <h1>{text.title}</h1>
                <p className="switch-accounts-description">
                    {text.description}
                </p>

                {accounts.length === 0 ? (
                    <p>{text.noAccounts}</p>
                ) : (
                    <div className="saved-accounts-list">
                        {accounts.map((account) => {
                            const isCurrent = account.id === activeId;

                            return (
                                <article
                                    className="saved-account"
                                    key={account.id}
                                >
                                    <div className="saved-account-info">
                                        <div className="saved-account-avatar">
                                            {(account.name || text.name)
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="saved-account-details">
                                            <strong>
                                                {account.name || text.name}
                                            </strong>
                                            <span>{account.email}</span>

                                            {isCurrent && (
                                                <small>
                                                    {text.current}
                                                </small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="saved-account-actions">
                                        {!isCurrent && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    switchAccount(account)
                                                }
                                            >
                                                {text.switch}
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className="remove-saved-account"
                                            onClick={() =>
                                                removeAccount(account.id)
                                            }
                                        >
                                            {text.remove}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                <Link
                    to="/login"
                    className="add-account-link"
                    onClick={() =>
                        sessionStorage.setItem(
                            "addingAnotherAccount",
                            "true"
                        )
                    }
                >
                    + {text.add}
                </Link>

                <Link to="/" className="back-marketplace-link">
                    {text.back}
                </Link>
            </section>
        </main>
    );
}

export default SwitchAccounts;