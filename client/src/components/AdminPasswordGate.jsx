
import { useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = "https://my-marketplace-api.onrender.com";
const ACCESS_KEY = "adminPageUnlocked";

function AdminPasswordGate({ children }) {
    const [unlocked, setUnlocked] = useState(
        sessionStorage.getItem(ACCESS_KEY) === "true"
    );
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/admin/password-check`,
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
                throw new Error(
                    response.status === 401
                        ? "Incorrect admin password."
                        : data.message || "Could not verify the password."
                );
            }

            sessionStorage.setItem(ACCESS_KEY, "true");
            setUnlocked(true);
            setPassword("");
        } catch (err) {
            setError(
                err.message || "Could not connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLock = () => {
        sessionStorage.removeItem(ACCESS_KEY);
        setUnlocked(false);
        setPassword("");
        setError("");
    };

    if (unlocked) {
        return (
            <div>
                <button
                    type="button"
                    onClick={handleLock}
                    style={{
                        display: "block",
                        margin: "16px auto",
                        padding: "10px 18px",
                        cursor: "pointer"
                    }}
                >
                    Lock admin page
                </button>

                {children}
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px"
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    maxWidth: "380px",
                    padding: "28px",
                    border: "1px solid #ddd",
                    borderRadius: "14px",
                    boxSizing: "border-box"
                }}
            >
                <h1>Admin access</h1>
                <p>Enter your separate admin password to continue.</p>

                <label
                    htmlFor="admin-password"
                    style={{ display: "block", marginBottom: "8px" }}
                >
                    Admin password
                </label>

                <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    autoFocus
                    style={{
                        width: "100%",
                        padding: "12px",
                        boxSizing: "border-box",
                        marginBottom: "14px"
                    }}
                />

                {error && (
                    <p role="alert" style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        cursor: loading ? "wait" : "pointer"
                    }}
                >
                    {loading ? "Checking..." : "Unlock admin page"}
                </button>
            </form>
        </div>
    );
}

export default AdminPasswordGate;