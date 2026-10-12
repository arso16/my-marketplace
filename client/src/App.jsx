
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./LanguageContext";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetail";
import Account from "./pages/Account";
import CategoryPage from "./pages/CategoryPage";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPasswordGate from "./components/AdminPasswordGate";
import SellerProfile from "./pages/SellerProfile";
import Messages from "./pages/Messages";
import SwitchAccounts from "./pages/SwitchAccounts";

function App() {
    return (
        <BrowserRouter>
            <LanguageProvider>
                <Navbar />

                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/create-product"
                            element={
                                <ProtectedRoute>
                                    <CreateProduct />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/edit-product/:id" element={<EditProduct />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/sellers/:id" element={<SellerProfile />} />
                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
                                    <Account />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/category/:category" element={<CategoryPage />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminPasswordGate>
                                        <AdminDashboard />
                                    </AdminPasswordGate>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/messages"
                            element={
                                <ProtectedRoute>
                                    <Messages />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/switch-accounts"
                            element={
                                <ProtectedRoute>
                                    <SwitchAccounts />
                                </ProtectedRoute>
                            }
                        />



                        
                    </Routes>
                    <Footer />
                </main>
            </LanguageProvider>
        </BrowserRouter>
    );
}

export default App;