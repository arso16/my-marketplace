
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./Register.css";

const registerTranslations = {
    en: {
        title: "Register",
        name: "Name",
        email: "Email",
        password: "Password",
        chooseAvatar: "Choose your avatar",
        male: "Male",
        female: "Female",
        uploadPicture: "Upload your own picture (optional)",
        preview: "Profile preview",
        pleaseWait: "Please wait...",
        verifyTitle: "Verify your email",
        enterCode: "Enter the six-digit code sent to",
        codePlaceholder: "Six-digit code",
        verifying: "Verifying...",
        verifyEmail: "Verify email",
        backToRegistration: "Back to registration",
        login: "Log in",
        forgotPassword: "Forgot password?",
        selectImage: "Please select an image file.",
        imageTooLarge: "Please choose an image smaller than 2 MB.",
        registrationFailed: "Registration failed",
        verificationFailed: "Email verification failed",
        codeSent: "A verification code has been sent to your email.",
        verified: "Email verified successfully. Please log in."
    },
    hy: {
        title: "Գրանցվել",
        name: "Անուն",
        email: "Էլեկտրոնային փոստ",
        password: "Գաղտնաբառ",
        chooseAvatar: "Ընտրեք ձեր ավատարը",
        male: "Արական",
        female: "Իգական",
        uploadPicture: "Վերբեռնել ձեր նկարը (ըստ ցանկության)",
        preview: "Պրոֆիլի նկարի նախադիտում",
        pleaseWait: "Խնդրում ենք սպասել...",
        verifyTitle: "Հաստատեք ձեր էլեկտրոնային փոստը",
        enterCode: "Մուտքագրեք ձեր էլեկտրոնային փոստին ուղարկված վեցանիշ կոդը",
        codePlaceholder: "Վեցանիշ կոդ",
        verifying: "Հաստատվում է...",
        verifyEmail: "Հաստատել էլեկտրոնային փոստը",
        backToRegistration: "Վերադառնալ գրանցմանը",
        login: "Մուտք գործել",
        forgotPassword: "Մոռացե՞լ եք գաղտնաբառը",
        selectImage: "Խնդրում ենք ընտրել նկարի ֆայլ։",
        imageTooLarge: "Ընտրեք 2 ՄԲ-ից փոքր նկար։",
        registrationFailed: "Գրանցումը չհաջողվեց",
        verificationFailed: "Էլեկտրոնային փոստի հաստատումը չհաջողվեց",
        codeSent: "Հաստատման կոդն ուղարկվել է ձեր էլեկտրոնային փոստին։",
        verified: "Էլեկտրոնային փոստը հաստատված է։ Խնդրում ենք մուտք գործել։"
    },
    ru: {
        title: "Регистрация",
        name: "Имя",
        email: "Электронная почта",
        password: "Пароль",
        chooseAvatar: "Выберите аватар",
        male: "Мужской",
        female: "Женский",
        uploadPicture: "Загрузить своё фото (необязательно)",
        preview: "Предпросмотр профиля",
        pleaseWait: "Пожалуйста, подождите...",
        verifyTitle: "Подтвердите электронную почту",
        enterCode: "Введите шестизначный код, отправленный на",
        codePlaceholder: "Шестизначный код",
        verifying: "Проверка...",
        verifyEmail: "Подтвердить почту",
        backToRegistration: "Вернуться к регистрации",
        login: "Войти",
        forgotPassword: "Забыли пароль?",
        selectImage: "Пожалуйста, выберите файл изображения.",
        imageTooLarge: "Выберите изображение размером менее 2 МБ.",
        registrationFailed: "Не удалось зарегистрироваться",
        verificationFailed: "Не удалось подтвердить почту",
        codeSent: "Код подтверждения отправлен на вашу почту.",
        verified: "Почта успешно подтверждена. Пожалуйста, войдите."
    }
};

function Register() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const text = registerTranslations[language] || registerTranslations.en;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("male");
    const [profilePicture, setProfilePicture] = useState("");
    const [preview, setPreview] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationStep, setVerificationStep] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePictureChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setProfilePicture("");
            setPreview("");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert(text.selectImage);
            e.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert(text.imageTooLarge);
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setProfilePicture(reader.result);
            setPreview(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                "https://my-marketplace-api.onrender.com/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        gender,
                        profilePicture
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.registrationFailed);
            }

            setEmail(data.email || email.trim().toLowerCase());
            setVerificationStep(true);
            alert(text.codeSent);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                "https://my-marketplace-api.onrender.com/users/verify-email",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        code: verificationCode.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || text.verificationFailed);
            }

            alert(text.verified);
            navigate("/login");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-box">
                {!verificationStep ? (
                    <>
                        <h1>{text.title}</h1>

                        <form onSubmit={handleRegister}>
                            <input
                                type="text"
                                placeholder={text.name}
                                aria-label={text.name}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <input
                                type="email"
                                placeholder={text.email}
                                aria-label={text.email}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder={text.password}
                                aria-label={text.password}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />

                            <label htmlFor="gender">{text.chooseAvatar}</label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="male">{text.male}</option>
                                <option value="female">{text.female}</option>
                            </select>

                            <label htmlFor="profile-picture">
                                {text.uploadPicture}
                            </label>

                            <input
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                onChange={handlePictureChange}
                            />

                            {preview && (
                                <div className="profile-picture-preview">
                                    <img src={preview} alt={text.preview} />
                                </div>
                            )}

                            <button type="submit" disabled={loading}>
                                {loading ? text.pleaseWait : text.title}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1>{text.verifyTitle}</h1>
                        <p>
                            {text.enterCode} {email}.
                        </p>

                        <form onSubmit={handleVerifyEmail}>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder={text.codePlaceholder}
                                value={verificationCode}
                                onChange={(e) =>
                                    setVerificationCode(
                                        e.target.value.replace(/\D/g, "").slice(0, 6)
                                    )
                                }
                                pattern="[0-9]{6}"
                                maxLength={6}
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading || verificationCode.length !== 6}
                            >
                                {loading ? text.verifying : text.verifyEmail}
                            </button>
                        </form>

                        <button
                            className="back-to-registration"
                            type="button"
                            onClick={() => setVerificationStep(false)}
                            disabled={loading}
                        >
                            {text.backToRegistration}
                        </button>
                    </>
                )}
            </div>

            <div className="register-links">
                <Link to="/login">{text.login}</Link>
                <Link to="/forgot-password">{text.forgotPassword}</Link>
            </div>
        </div>
    );
}

export default Register;