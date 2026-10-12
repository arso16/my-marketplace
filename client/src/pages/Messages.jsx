
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Messages.css";

const API = "http://192.168.123.14:3000";

function getTokenPayload(token) {
    try {
        const part = token?.split(".")[1];
        if (!part) return null;
        const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

function getId(value) {
    if (!value) return "";
    return String(typeof value === "object" ? value._id || value.id || "" : value);
}

function Messages() {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get("product");
    const sellerId = searchParams.get("seller");
    const buyerId = searchParams.get("buyer");
    const token = localStorage.getItem("token");
    const payload = getTokenPayload(token);
    const currentUserId = getId(
        payload?.userId || payload?.id || payload?._id || payload?.sub
    );

    const [messages, setMessages] = useState([]);
    const [inbox, setInbox] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const isConversation = Boolean(productId && sellerId);
    const isSeller = Boolean(currentUserId && sellerId && currentUserId === sellerId);
    const otherUserId = isSeller ? buyerId : sellerId;

    const loadInbox = useCallback(async () => {
        const response = await fetch(`${API}/messages/inbox`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load inbox");
        }

        setInbox(Array.isArray(data) ? data : []);
    }, [token]);

    const loadConversation = useCallback(async () => {
        const query = buyerId ? `?buyer=${encodeURIComponent(buyerId)}` : "";
        const response = await fetch(
            `${API}/messages/${productId}/${sellerId}${query}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load conversation");
        }

        setMessages(Array.isArray(data) ? data : []);
        window.dispatchEvent(new Event("messagesRead"));
    }, [productId, sellerId, buyerId, token]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");

            if (!token) {
                setError("Please log in to view messages.");
                setLoading(false);
                return;
            }

            try {
                if (isConversation) {
                    await loadConversation();
                } else {
                    await loadInbox();
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [token, isConversation, loadInbox, loadConversation]);

    const handleSend = async (event) => {
        event.preventDefault();

        if (!messageText.trim() || sending) return;

        if (!productId || !sellerId || !otherUserId) {
            setError("Conversation information is missing.");
            return;
        }

        setSending(true);
        setError("");

        try {
            const response = await fetch(`${API}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver: otherUserId,
                    product: productId,
                    text: messageText.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send message");
            }

            setMessages((previous) => [...previous, data]);
            setMessageText("");
        } catch (err) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <main className="messages-page">
                <p>Loading messages...</p>
            </main>
        );
    }

    if (!isConversation) {
        return (
            <main className="messages-page messages-inbox-page">
                <section className="messages-panel">
                    <header className="messages-header">
                        <div>
                            <h1>Messages</h1>
                            <p>Your conversations with buyers and sellers</p>
                        </div>
                    </header>

                    {error && <p className="messages-error">{error}</p>}

                    {!error && inbox.length === 0 && (
                        <p className="messages-empty">
                            No messages yet. Open a product and choose Send Message to start a conversation.
                        </p>
                    )}

                    <div className="messages-inbox">
                        {inbox.map((conversation) => {
                            const product = conversation.product || {};
                            const conversationProductId = getId(product);
                            const conversationSellerId = getId(conversation.seller);
                            const conversationBuyerId = getId(conversation.buyer);
                            const otherUser = conversation.otherUser || {};
                            const destination =
                                `/messages?product=${encodeURIComponent(conversationProductId)}` +
                                `&seller=${encodeURIComponent(conversationSellerId)}` +
                                (currentUserId === conversationSellerId
                                    ? `&buyer=${encodeURIComponent(conversationBuyerId)}`
                                    : "");

                            return (
                                <Link
                                    key={conversation._id}
                                    to={destination}
                                    className="messages-inbox-item"
                                >
                                    <div>
                                        <strong>{otherUser.name || "User"}</strong>
                                        <p>{product.title || "Product conversation"}</p>
                                        <span>
                                            {conversation.lastMessage?.text || "Open conversation"}
                                        </span>
                                    </div>

                                    {Number(conversation.unreadCount) > 0 && (
                                        <span className="messages-unread-count">
                                            {conversation.unreadCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="messages-page">
            <section className="messages-panel">
                <header className="messages-header">
                    <div>
                        <h1>Messages</h1>
                        <p>Conversation about a marketplace product</p>
                    </div>
                    <Link to="/messages" className="messages-back">
                        Back to inbox
                    </Link>
                </header>

                {error && <p className="messages-error">{error}</p>}

                <div className="messages-list">
                    {messages.length === 0 ? (
                        <p className="messages-empty">No messages yet.</p>
                    ) : (
                        messages.map((message) => {
                            const isMine = getId(message.sender) === currentUserId;

                            return (
                                <div
                                    key={message._id}
                                    className={`message-bubble ${isMine ? "mine" : "theirs"}`}
                                >
                                    <span className="message-sender">
                                        {isMine ? "You" : message.sender?.name || "User"}
                                    </span>
                                    <p>{message.text}</p>
                                    <time>
                                        {message.createdAt
                                            ? new Date(message.createdAt).toLocaleString()
                                            : ""}
                                    </time>
                                </div>
                            );
                        })
                    )}
                </div>

                <form className="messages-form" onSubmit={handleSend}>
                    <textarea
                        value={messageText}
                        onChange={(event) => setMessageText(event.target.value)}
                        placeholder="Write your message..."
                        maxLength={2000}
                        rows={3}
                        required
                    />
                    <button
                        type="submit"
                        disabled={sending || !messageText.trim() || !otherUserId}
                    >
                        {sending ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Messages;