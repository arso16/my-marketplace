
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./SellerProfile.css";

const API_URL = "http://192.168.123.14:3000";

function SellerProfile() {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSeller = async () => {
            try {
                setLoading(true);
                setError("");

                const [sellerResponse, productsResponse] = await Promise.all([
                    fetch(`${API_URL}/users/sellers/${id}`),
                    fetch(`${API_URL}/users/sellers/${id}/products`)
                ]);

                if (!sellerResponse.ok) {
                    throw new Error("Seller not found.");
                }

                if (!productsResponse.ok) {
                    throw new Error("Could not load seller's products.");
                }

                const sellerData = await sellerResponse.json();
                const productsData = await productsResponse.json();

                setSeller(sellerData);
                setProducts(productsData);
            } catch (err) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        loadSeller();
    }, [id]);

    if (loading) {
        return <div className="seller-profile-message">Loading seller profile...</div>;
    }

    if (error || !seller) {
        return (
            <div className="seller-profile-message">
                {error || "Seller not found."}
            </div>
        );
    }

    return (
        <div className="seller-profile">
            <section className="seller-profile-header">
                {seller.profilePicture ? (
                    <img
                        className="seller-profile-avatar"
                        src={seller.profilePicture}
                        alt={seller.name}
                    />
                ) : (
                    <div className="seller-profile-avatar seller-profile-avatar-placeholder">
                        {seller.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                )}

                <div className="seller-profile-info">
                    <h1>{seller.name}</h1>
                    <p>{products.length} product(s)</p>
                </div>
            </section>

            <section className="seller-contact">
                <h2>Contact seller</h2>

                {seller.phoneNumber && (
                    <a href={`tel:${seller.phoneNumber}`} className="seller-contact-link">
                        Call: {seller.phoneNumber}
                    </a>
                )}

                {seller.instagram && (
                    <a
                        href={seller.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="seller-contact-link"
                    >
                        Instagram
                    </a>
                )}

                {seller.facebook && (
                    <a
                        href={seller.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="seller-contact-link"
                    >
                        Facebook
                    </a>
                )}

                {!seller.phoneNumber && !seller.instagram && !seller.facebook && (
                    <p>This seller hasn't added contact details yet.</p>
                )}
            </section>

            <section className="seller-products-section">
                <h2>Products by {seller.name}</h2>

                {products.length === 0 ? (
                    <p>This seller hasn't listed any products yet.</p>
                ) : (
                    <div className="seller-products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <Link to="/" className="seller-back-link">
                Back to home
            </Link>
        </div>
    );
}

export default SellerProfile;