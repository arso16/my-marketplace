
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./ForgotPassword.css";

const translations = {
    en: {
        title: "Forgot Password?",
        description: "Enter your email to receive a password reset link.",
        email: "Email",
        sending: "Sending...",
        send: "Send Reset Link",
        success: "If an account exists for this email, a password reset link will be sent. Check your inbox and spam folder.",
        error: "Unable to send the request.",
        back: "Back to Registration",
        somethingWrong: "Something went wrong"
    },
    hy: {
        title: "Մոռացե՞լ եք գաղտնաբառը",
        description: "Մուտքագրեք ձեր էլեկտրոնային փոստը՝ գաղտնաբառը վերականգնելու հղում ստանալու համար։",
        email: "Էլեկտրոնային փոստ",
        sending: "Ուղարկվում է...",
        send: "Ուղարկել վերականգնման հղումը",
        success: "Եթե այս էլեկտրոնային փոստով հաշիվ գոյություն ունի, կուղարկվի գաղտնաբառի վերականգնման հղում։ Ստուգեք մուտքային նամակներն ու սպամի թղթապանակը։",
        error: "Հարցումն ուղարկել չհաջողվեց։",
        back: "Վերադառնալ գրանցմանը",
        somethingWrong: "Ինչ-որ բան սխալ է տեղի ունեցել"
    },
    ru: {
        title: "Забыли пароль?",
        description: "Введите электронную почту, чтобы получить ссылку для сброса пароля.",
        email: "Электронная почта",
        sending: "Отправка...",
        send: "Отправить ссылку для сброса",
        success: "Если аккаунт с этой почтой существует, ссылка для сброса пароля будет отправлена. Проверьте входящие и папку со спамом.",
        error: "Не удалось отправить запрос.",
        back: "Вернуться к регистрации",
        somethingWrong: "Что-то пошло не так"
    }
};

function ForgotPassword() {
    const { language } = useLanguage();
    const text = translations[language] || translations.en;

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://my-marketplace-api.onrender.com/users/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.somethingWrong);
            }

            setMessage(text.success);
        } catch (err) {
            setError(err.message || text.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-box">
                <h1>{text.title}</h1>

                <p>{text.description}</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder={text.email}
                        aria-label={text.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? text.sending : text.send}
                    </button>
                </form>

                {message && (
                    <p className="success-message" role="status">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message" role="alert">
                        {error}
                    </p>
                )}

                <Link className="back-to-register" to="/register">
                    {text.back}
                </Link>
            </div>
        </div>
    );
}

export default ForgotPassword;