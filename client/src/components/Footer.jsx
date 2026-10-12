
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import "./Footer.css";

const translations = {
    en: {
        description: "Buy and sell products easily. Find great deals and discover something new.",
        explore: "Explore",
        home: "Home",
        electronics: "Electronics",
        fashion: "Fashion",
        computers: "Computers",
        account: "Account",
        login: "Log In",
        register: "Register",
        myAccount: "My Account",
        sellProduct: "Sell a Product",
        marketplace: "Marketplace",
        slogan: "Buy smart. Sell easily.",
        accountHelp: "Account Help",
        rights: "All rights reserved."
    },
    hy: {
        description: "Գնեք և վաճառեք ապրանքներ հեշտությամբ։ Գտեք շահավետ առաջարկներ և բացահայտեք նոր բաներ։",
        explore: "Ուսումնասիրել",
        home: "Գլխավոր",
        electronics: "Էլեկտրոնիկա",
        fashion: "Հագուստ",
        computers: "Համակարգիչներ",
        account: "Հաշիվ",
        login: "Մուտք գործել",
        register: "Գրանցվել",
        myAccount: "Իմ հաշիվը",
        sellProduct: "Վաճառել ապրանք",
        marketplace: "Առևտրային հարթակ",
        slogan: "Գնեք խելամիտ։ Վաճառեք հեշտությամբ։",
        accountHelp: "Հաշվի օգնություն",
        rights: "Բոլոր իրավունքները պաշտպանված են։"
    },
    ru: {
        description: "Покупайте и продавайте товары легко. Находите выгодные предложения и открывайте для себя что-то новое.",
        explore: "Обзор",
        home: "Главная",
        electronics: "Электроника",
        fashion: "Одежда",
        computers: "Компьютеры",
        account: "Аккаунт",
        login: "Войти",
        register: "Регистрация",
        myAccount: "Мой аккаунт",
        sellProduct: "Продать товар",
        marketplace: "Маркетплейс",
        slogan: "Покупайте выгодно. Продавайте легко.",
        accountHelp: "Помощь с аккаунтом",
        rights: "Все права защищены."
    }
};

function Footer() {
    const { language } = useLanguage();
    const text = translations[language] || translations.en;

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(Boolean(localStorage.getItem("token")));
        };

        window.addEventListener("authChanged", checkLogin);
        window.addEventListener("storage", checkLogin);

        return () => {
            window.removeEventListener("authChanged", checkLogin);
            window.removeEventListener("storage", checkLogin);
        };
    }, []);

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        My Marketplace
                    </Link>

                    <p>{text.description}</p>
                </div>

                <div className="footer-links">
                    <h3>{text.explore}</h3>
                    <Link to="/">{text.home}</Link>
                    <Link to="/category/Electronics">{text.electronics}</Link>
                    <Link to="/category/Fashion">{text.fashion}</Link>
                    <Link to="/category/Computers">{text.computers}</Link>
                </div>

                <div className="footer-links">
                    <h3>{text.account}</h3>

                    {!isLoggedIn && (
                        <>
                            <Link to="/login">{text.login}</Link>
                            <Link to="/register">{text.register}</Link>
                        </>
                    )}

                    {isLoggedIn && (
                        <Link to="/account">{text.myAccount}</Link>
                    )}

                    {isLoggedIn && (
                        <Link to="/create-product">{text.sellProduct}</Link>
                    )}
                </div>

                <div className="footer-contact">
                    <h3>{text.marketplace}</h3>
                    <p>{text.slogan}</p>
                    <Link to="/forgot-password">{text.accountHelp}</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} My Marketplace.{" "}
                    {text.rights}
                </p>
            </div>
        </footer>
    );
}

export default Footer;