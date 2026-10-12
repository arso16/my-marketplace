
import { useLanguage } from "../LanguageContext";
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "./NavBar.css";

const API = "https://my-marketplace-api.onrender.com";

const navbarTranslations = {
    en: {
        searchButton: "Search",
        chooseLanguage: "Choose language",
        messages: "Messages",
        unreadMessages: "Unread messages",
        logIn: "Log In"
    },
    hy: {
        searchButton: "Որոնել",
        chooseLanguage: "Ընտրել լեզուն",
        messages: "Հաղորդագրություններ",
        unreadMessages: "Չկարդացված հաղորդագրություններ",
        logIn: "Մուտք"
    },
    ru: {
        searchButton: "Поиск",
        chooseLanguage: "Выбрать язык",
        messages: "Сообщения",
        unreadMessages: "Непрочитанные сообщения",
        logIn: "Войти"
    }
};

function NavBar() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [unreadCount, setUnreadCount] = useState(0);
    const { language, changeLanguage, t } = useLanguage();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showTopBar, setShowTopBar] = useState(true);
    const [showBottomBar, setShowBottomBar] = useState(false);

    const extraText = navbarTranslations[language] || navbarTranslations.en;

    useEffect(() => {
        const updateToken = () => setToken(localStorage.getItem("token"));

        window.addEventListener("storage", updateToken);
        window.addEventListener("authChanged", updateToken);

        return () => {
            window.removeEventListener("storage", updateToken);
            window.removeEventListener("authChanged", updateToken);
        };
    }, []);

    useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    useEffect(() => {
        if (!token) {
            setUnreadCount(0);
            return;
        }

        let cancelled = false;

        const loadUnreadCount = async () => {
            try {
                const response = await fetch(`${API}/messages/unread-count`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (!cancelled) setUnreadCount(0);
                    return;
                }

                const data = await response.json();

                if (!cancelled) {
                    setUnreadCount(Number(data.unreadCount) || 0);
                }
            } catch {
                if (!cancelled) setUnreadCount(0);
            }
        };

        loadUnreadCount();

        const intervalId = window.setInterval(loadUnreadCount, 10000);
        const refreshUnread = () => loadUnreadCount();

        window.addEventListener("authChanged", refreshUnread);
        window.addEventListener("messagesRead", refreshUnread);

        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
            window.removeEventListener("authChanged", refreshUnread);
            window.removeEventListener("messagesRead", refreshUnread);
        };
    }, [token]);

    useEffect(() => {
        let previousY = window.scrollY;
        let previousDirection = "";

        const updateBars = () => {
            const currentY = window.scrollY;
            const difference = currentY - previousY;

            if (window.innerWidth > 600) {
                setShowTopBar(true);
                setShowBottomBar(false);
                previousY = currentY;
                return;
            }

            if (currentY <= 10) {
                setShowTopBar(true);
                setShowBottomBar(false);
                previousDirection = "";
                previousY = currentY;
                return;
            }

            if (Math.abs(difference) >= 4) {
                const direction = difference < 0 ? "up" : "down";

                if (direction !== previousDirection) {
                    if (direction === "up") {
                        setShowTopBar(true);
                        setShowBottomBar(false);
                    } else {
                        setShowTopBar(false);
                        setShowBottomBar(true);
                    }

                    previousDirection = direction;
                }

                previousY = currentY;
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 600) {
                setShowTopBar(true);
                setShowBottomBar(false);
            } else if (window.scrollY <= 10) {
                setShowTopBar(true);
                setShowBottomBar(false);
            }
        };

        window.addEventListener("scroll", updateBars, { passive: true });
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", updateBars);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();

        const query = search.trim();

        if (!query) {
            navigate("/");
            return;
        }

        navigate(`/?search=${encodeURIComponent(query)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("activeAccountId");
        setToken(null);
        setUnreadCount(0);
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
    };

    const text = {
        home: t("home"),
        register: t("register"),
        sell: t("sell"),
        account: t("account"),
        logout: t("logout"),
        search: t("search")
    };

    const messagesLink = (
        <Link
            to="/messages"
            className="navbar-messages-link"
            aria-label={
                unreadCount > 0
                    ? `${extraText.messages}: ${unreadCount} ${extraText.unreadMessages}`
                    : extraText.messages
            }
        >
            <span className="messages-icon" aria-hidden="true">✉</span>
            <span className="messages-label">{extraText.messages}</span>
            {unreadCount > 0 && (
                <span className="navbar-unread-dot" aria-hidden="true" />
            )}
        </Link>
    );

    return (
        <>
            <nav className="navbar">
                <div
                    className="navbar-logo"
                    onClick={() => navigate("/")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") navigate("/");
                    }}
                >
                    My Marketplace
                </div>

                <form className="navbar-search" onSubmit={handleSearch}>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={text.search}
                        aria-label={text.search}
                    />
                    <button type="submit" aria-label={extraText.searchButton}>
                        🔍
                    </button>
                </form>

                <div className="navbar-links">
                    <Link to="/">{text.home}</Link>

                    {!token && (
                        <>
                            <Link to="/register">{text.register}</Link>
                            <Link to="/login">{extraText.logIn}</Link>
                        </>
                    )}

                    {token && (
                        <>
                            <Link to="/create-product">{text.sell}</Link>
                            {messagesLink}
                            <Link to="/account">{text.account}</Link>
                            <button type="button" className="logout-button" onClick={handleLogout}>
                                {text.logout}
                            </button>
                        </>
                    )}

                    <select
                        className="navbar-language"
                        value={language}
                        onChange={(event) => changeLanguage(event.target.value)}
                        aria-label={extraText.chooseLanguage}
                    >
                        <option value="hy">Հայերեն</option>
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                    </select>
                </div>

                <div className={`mobile-navbar-top ${showTopBar ? "mobile-navbar-visible" : ""}`}>
                    <div
                        className="mobile-navbar-logo"
                        onClick={() => navigate("/")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") navigate("/");
                        }}
                    >
                        My Marketplace
                    </div>

                    <div className="mobile-navbar-actions">
                        {token && messagesLink}
                        <select
                            className="navbar-language"
                            value={language}
                            onChange={(event) => changeLanguage(event.target.value)}
                            aria-label={extraText.chooseLanguage}
                        >
                            <option value="hy">HY</option>
                            <option value="ru">RU</option>
                            <option value="en">EN</option>
                        </select>
                    </div>

                    <form className="mobile-navbar-search" onSubmit={handleSearch}>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={text.search}
                            aria-label={text.search}
                        />
                        <button type="submit" aria-label={extraText.searchButton}>
                            🔍
                        </button>
                    </form>
                </div>
            </nav>

            <nav
                className={`mobile-bottom-navbar ${showBottomBar ? "mobile-bottom-visible" : "mobile-bottom-hidden"}`}
                aria-label="Mobile navigation"
            >
                <Link to="/" className="mobile-nav-item">
                    <span aria-hidden="true">⌂</span>
                    <span>{text.home}</span>
                </Link>

                {token ? (
                    <>
                        <Link to="/create-product" className="mobile-nav-item">
                            <span aria-hidden="true">＋</span>
                            <span>{text.sell}</span>
                        </Link>
                        <Link to="/account" className="mobile-nav-item">
                            <span aria-hidden="true">♙</span>
                            <span>{text.account}</span>
                        </Link>
                        <button type="button" className="mobile-nav-item mobile-nav-logout" onClick={handleLogout}>
                            <span style={{fontSize: "15px"}}>{text.logout}</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/register" className="mobile-nav-item">
                            <span aria-hidden="true">＋</span>
                            <span>{text.register}</span>
                        </Link>
                        <Link to="/login" className="mobile-nav-item">
                            <span aria-hidden="true">♙</span>
                            <span>{extraText.logIn}</span>
                        </Link>
                    </>
                )}
            </nav>
        </>
    );
}

export default NavBar;