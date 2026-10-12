
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./ResetPassword.css";

const translations = {
    en: {
        title: "Reset Password",
        description: "Enter your new password.",
        newPassword: "New password",
        confirmPassword: "Confirm new password",
        resetting: "Resetting...",
        reset: "Reset Password",
        success: "Password reset successfully. Redirecting to login...",
        missingToken: "The password reset link is missing its token.",
        shortPassword: "Password must be at least 6 characters long.",
        mismatch: "Passwords do not match.",
        failed: "Password reset failed.",
        error: "Unable to reset your password.",
        back: "Back to Login"
    },
    hy: {
        title: "Վերականգնել գաղտնաբառը",
        description: "Մուտքագրեք ձեր նոր գաղտնաբառը։",
        newPassword: "Նոր գաղտնաբառ",
        confirmPassword: "Հաստատեք նոր գաղտնաբառը",
        resetting: "Վերականգնվում է...",
        reset: "Վերականգնել գաղտնաբառը",
        success: "Գաղտնաբառը հաջողությամբ վերականգնվեց։ Վերահղում դեպի մուտքի էջ...",
        missingToken: "Գաղտնաբառի վերականգնման հղման կոդը բացակայում է։",
        shortPassword: "Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ։",
        mismatch: "Գաղտնաբառերը չեն համընկնում։",
        failed: "Գաղտնաբառի վերականգնումը չհաջողվեց։",
        error: "Չհաջողվեց վերականգնել գաղտնաբառը։",
        back: "Վերադառնալ մուտքի էջ"
    },
    ru: {
        title: "Сброс пароля",
        description: "Введите новый пароль.",
        newPassword: "Новый пароль",
        confirmPassword: "Подтвердите новый пароль",
        resetting: "Сброс...",
        reset: "Сбросить пароль",
        success: "Пароль успешно изменён. Перенаправление на страницу входа...",
        missingToken: "В ссылке для сброса пароля отсутствует токен.",
        shortPassword: "Пароль должен содержать не менее 6 символов.",
        mismatch: "Пароли не совпадают.",
        failed: "Не удалось сбросить пароль.",
        error: "Не удалось изменить пароль.",
        back: "Вернуться ко входу"
    }
};

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const text = translations[language] || translations.en;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!token) {
            setError(text.missingToken);
            return;
        }

        if (password.length < 6) {
            setError(text.shortPassword);
            return;
        }

        if (password !== confirmPassword) {
            setError(text.mismatch);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `https://my-marketplace-api.onrender.com/users/reset-password/${encodeURIComponent(token)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.failed);
            }

            setMessage(text.success);

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.message || text.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-box">
                <h1>{text.title}</h1>

                <p>{text.description}</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder={text.newPassword}
                        aria-label={text.newPassword}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />

                    <input
                        type="password"
                        placeholder={text.confirmPassword}
                        aria-label={text.confirmPassword}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? text.resetting : text.reset}
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

                <Link className="back-to-login" to="/login">
                    {text.back}
                </Link>
            </div>
        </div>
    );
}

export default ResetPassword;