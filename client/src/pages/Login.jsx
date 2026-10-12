
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./Login.css";

const loginText = {
    en: {
        title: "Login",
        email: "Email",
        password: "Password",
        loggingIn: "Logging in...",
        login: "Login",
        backToRegister: "← Back to Registration",
        forgotPassword: "Forgot password?",
        loginFailed: "Login failed. Please check your email and password."
    },
    hy: {
        title: "Մուտք",
        email: "Էլեկտրոնային փոստ",
        password: "Գաղտնաբառ",
        loggingIn: "Մուտք է կատարվում...",
        login: "Մուտք գործել",
        backToRegister: "← Վերադառնալ գրանցմանը",
        forgotPassword: "Մոռացե՞լ եք գաղտնաբառը",
        loginFailed: "Մուտքը չհաջողվեց։ Ստուգեք ձեր էլեկտրոնային փոստը և գաղտնաբառը։"
    },
    ru: {
        title: "Вход",
        email: "Электронная почта",
        password: "Пароль",
        loggingIn: "Выполняется вход...",
        login: "Войти",
        backToRegister: "← Вернуться к регистрации",
        forgotPassword: "Забыли пароль?",
        loginFailed: "Не удалось войти. Проверьте электронную почту и пароль."
    }
};

function getTokenPayload(token) {
    try {
        const base64 = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        return JSON.parse(
            decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((char) =>
                        "%" + char.charCodeAt(0).toString(16).padStart(2, "0")
                    )
                    .join("")
            )
        );
    } catch {
        return {};
    }
}

function saveAccountSession(token, email, user) {
    const payload = getTokenPayload(token);

    const userId =
        user?._id ||
        user?.id ||
        payload.userId ||
        payload.id ||
        payload._id ||
        email.toLowerCase();

    let savedAccounts = [];

    try {
        const stored = JSON.parse(
            localStorage.getItem("savedAccounts") || "[]"
        );

        if (Array.isArray(stored)) {
            savedAccounts = stored;
        }
    } catch {
        savedAccounts = [];
    }

    const account = {
        id: String(userId),
        email: user?.email || email,
        name: user?.name || email.split("@")[0],
        token
    };

    savedAccounts = savedAccounts.filter(
        (item) => String(item.id) !== account.id
    );

    savedAccounts.push(account);

    localStorage.setItem(
        "savedAccounts",
        JSON.stringify(savedAccounts)
    );

    localStorage.setItem("token", token);
    localStorage.setItem("activeAccountId", account.id);
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { language } = useLanguage();
    const text = loginText[language] || loginText.en;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                "https://my-marketplace-api.onrender.com/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.token) {
                throw new Error(text.loginFailed);
            }

            const accountEmail = data.user?.email || email;
            saveAccountSession(data.token, accountEmail, data.user);

            window.dispatchEvent(new Event("authChanged"));

            navigate("/");
        } catch (err) {
            console.error(err);
            alert(err.message || text.loginFailed);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h1>{text.title}</h1>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder={text.email}
                        aria-label={text.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <input
                        type="password"
                        placeholder={text.password}
                        aria-label={text.password}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? text.loggingIn : text.login}
                    </button>

                    <Link to="/register" className="back-to-register">
                        {text.backToRegister}
                    </Link>
                </form>

                <Link className="forgot-password-link" to="/forgot-password">
                    {text.forgotPassword}
                </Link>
            </div>
        </div>
    );
}

export default Login;