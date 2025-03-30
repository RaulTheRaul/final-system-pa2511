import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState("jobseeker");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setBusinessName("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Basic form validation
        if (!email || !password) {
            setError("Please fill in all required fields");
            setLoading(false);
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!isLogin && userType === "business" && !businessName) {
            setError("Business name is required");
            setLoading(false);
            return;
        }

        if (!isLogin && userType === "jobseeker" && !fullName) {
            setError("Full name is required");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // Handle login with Firebase
                await login(email, password);
            } else {
                // Handle signup with Firebase
                const profileData = userType === "jobseeker"
                    ? { fullName }
                    : { businessName };

                await signup(email, password, userType, profileData);
            }
            resetForm();
        } catch (err) {
            console.error("Authentication error:", err);
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-4xl font-bold text-blue-600">Childcare Connect</h1>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? "Sign in to your account" : "Create a new account"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isLogin ? "New to our platform? " : "Already have an account? "}
                        <button
                            type="button"
                            className="font-medium text-blue-600 hover:text-blue-500"
                            onClick={toggleForm}
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
                {!isLogin && (
                    < div className="flex justify-center space-x-4">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-md ${userType === "jobseeker"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                                }`}
                            onClick={() => setUserType("jobseeker")}
                        >
                            Job Seeker
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-md ${userType === "business"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                                }`}
                            onClick={() => setUserType("business")}
                        >
                            Business
                        </button>
                    </div>

                )}


                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {/* Conditional fields based on form type */}
                        {!isLogin && userType === "jobseeker" && (
                            <div>
                                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="John Smith"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        )}

                        {!isLogin && userType === "business" && (
                            <div>
                                <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                                    Business Name
                                </label>
                                <input
                                    id="business-name"
                                    name="businessName"
                                    type="text"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="ABC Childcare Center"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder={isLogin ? "Your password" : "Create a password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                        >
                            {loading ? "Processing..." : isLogin ? "Sign in" : "Sign up"}
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
}

export default AuthPage;