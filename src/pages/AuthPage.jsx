import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
    const { login, signup, resendVerificationEmail } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState("jobseeker");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState("");
    const [resendPassword, setResendPassword] = useState("");

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password validation rules
    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 6) {
            errors.push("Password must be at least 6 characters long");
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        return errors;
    };

    // Name validation
    const validateName = (name, fieldName) => {
        const errors = [];
        if (!name.trim()) {
            errors.push(`${fieldName} is required`);
        } else if (name.trim().length < 2) {
            errors.push(`${fieldName} must be at least 2 characters long`);
        } else if (name.trim().length > 50) {
            errors.push(`${fieldName} must be less than 50 characters`);
        } else if (!/^[a-zA-Z\s'-]+$/.test(name.trim()) && fieldName === "Full name") {
            errors.push("Full name can only contain letters, spaces, hyphens, and apostrophes");
        }
        return errors;
    };

    // Real-time field validation
    const validateField = (fieldName, value) => {
        let errors = [];

        switch (fieldName) {
            case 'email':
                if (!value.trim()) {
                    errors.push("Email is required");
                } else if (!emailRegex.test(value)) {
                    errors.push("Please enter a valid email address");
                }
                break;

            case 'password':
                if (!value) {
                    errors.push("Password is required");
                } else if (!isLogin) {
                    errors = validatePassword(value);
                }
                break;

            case 'confirmPassword':
                if (!isLogin) {
                    if (!value) {
                        errors.push("Please confirm your password");
                    } else if (value !== password) {
                        errors.push("Passwords do not match");
                    }
                }
                break;

            case 'fullName':
                if (!isLogin && userType === "jobseeker") {
                    errors = validateName(value, "Full name");
                }
                break;

            case 'businessName':
                if (!isLogin && userType === "business") {
                    errors = validateName(value, "Business name");
                }
                break;

            default:
                break;
        }

        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: errors
        }));

        return errors.length === 0;
    };

    // Handle input changes with real-time validation
    const handleInputChange = (fieldName, value) => {
        // Update the field value
        switch (fieldName) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                // Also revalidate confirm password if it exists
                if (!isLogin && confirmPassword) {
                    setTimeout(() => validateField('confirmPassword', confirmPassword), 0);
                }
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'fullName':
                setFullName(value);
                break;
            case 'businessName':
                setBusinessName(value);
                break;
        }

        // Clear the general error when user starts typing
        if (error) {
            setError("");
        }

        // Validate the field after a short delay (debounced validation)
        setTimeout(() => validateField(fieldName, value), 300);
    };

    // Comprehensive form validation before submission
    const validateForm = () => {
        const errors = {};

        // Validate email
        if (!email.trim()) {
            errors.email = ["Email is required"];
        } else if (!emailRegex.test(email)) {
            errors.email = ["Please enter a valid email address"];
        }

        // Validate password
        if (!password) {
            errors.password = ["Password is required"];
        } else if (!isLogin) {
            const passwordErrors = validatePassword(password);
            if (passwordErrors.length > 0) {
                errors.password = passwordErrors;
            }
        }

        // Validate confirm password for signup
        if (!isLogin) {
            if (!confirmPassword) {
                errors.confirmPassword = ["Please confirm your password"];
            } else if (password !== confirmPassword) {
                errors.confirmPassword = ["Passwords do not match"];
            }

            // Validate name fields based on user type
            if (userType === "jobseeker") {
                const nameErrors = validateName(fullName, "Full name");
                if (nameErrors.length > 0) {
                    errors.fullName = nameErrors;
                }
            } else if (userType === "business") {
                const businessErrors = validateName(businessName, "Business name");
                if (businessErrors.length > 0) {
                    errors.businessName = businessErrors;
                }
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setBusinessName("");
        setError("");
        setFieldErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validate form before submission
        if (!validateForm()) {
            setError("Please correct the errors below");
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
                    ? { fullName: fullName.trim() }
                    : { businessName: businessName.trim() };

                await signup(email.trim(), password, userType, profileData);

                // Show verification message
                setVerificationSent(true);
                setVerificationEmail(email.trim());
                setResendPassword(password);

                // Clear sensitive form data
                setPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            console.error("Authentication error:", err);

            // Provide user-friendly error messages
            if (err.code) {
                switch (err.code) {
                    case 'auth/email-already-in-use':
                        setError("This email address is already in use. Please try logging in instead.");
                        break;
                    case 'auth/invalid-email':
                        setError("The email address is not valid. Please check and try again.");
                        break;
                    case 'auth/weak-password':
                        setError("Password is too weak. Please use at least 6 characters with letters and numbers.");
                        break;
                    case 'auth/user-not-found':
                        setError("No account found with this email address.");
                        break;
                    case 'auth/wrong-password':
                        setError("Incorrect password. Please try again.");
                        break;
                    case 'auth/too-many-requests':
                        setError("Too many unsuccessful login attempts. Please try again later.");
                        break;
                    case 'auth/invalid-credential':
                        setError("Invalid email or password. Please check your credentials and try again.");
                        break;
                    case 'auth/user-disabled':
                        setError("This account has been disabled. Please contact support.");
                        break;
                    case 'auth/network-request-failed':
                        setError("Network error. Please check your connection and try again.");
                        break;
                    default:
                        setError(err.message || "Authentication failed. Please try again.");
                }
            } else {
                setError(err.message || "Authentication failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!verificationEmail || !resendPassword) {
            setError("Email and password are required to resend verification");
            return;
        }

        setLoading(true);
        try {
            const result = await resendVerificationEmail(verificationEmail, resendPassword);
            setError("");

            if (result === true) {
                alert("Verification email resent successfully. Please check your inbox and spam folder.");
            } else {
                alert("Your email appears to be already verified. Please try logging in.");
                setVerificationSent(false);
                setIsLogin(true);
            }
        } catch (err) {
            console.error("Error resending verification email:", err);
            if (err.code === 'auth/wrong-password') {
                setError("Incorrect password. Unable to resend verification email.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many attempts. Please try again later.");
            } else if (err.code === 'auth/user-not-found') {
                setError("No account found with this email address.");
            } else {
                setError("Failed to resend verification email: " + (err.message || "Unknown error"));
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        resetForm();
        setVerificationSent(false);
    };

    // Helper function to render field errors
    const renderFieldError = (fieldName) => {
        const errors = fieldErrors[fieldName];
        if (!errors || errors.length === 0) return null;

        return (
            <div className="mt-1">
                {errors.map((error, index) => (
                    <p key={index} className="text-red-500 text-xs">
                        {error}
                    </p>
                ))}
            </div>
        );
    };

    // Helper function to get input border color based on validation state
    const getInputBorderClass = (fieldName) => {
        const errors = fieldErrors[fieldName];
        if (errors && errors.length > 0) {
            return "border-red-300 focus:border-red-500 focus:ring-red-500";
        }
        return "border-gray-300 focus:border-[#f2be5c] focus:ring-blue-500";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[#f2ece4] w-full py-6 px-4 sm:px-6 lg:px-8">
            <div className="hidden md:block">
                <img src="/images/login1sthalf.png" className="bg-no-repeat max-w-s max-h-250" alt="Decorative" />
            </div>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <img src="/images/Untitled-5.png" className="bg-no-repeat max-w-s max-h-auto" alt="Logo" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#254159]">
                        {isLogin ? "Sign in to your account" : "Create a new account"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isLogin ? "New to our platform? " : "Already have an account? "}
                        <button
                            type="button"
                            className="font-medium text-[#f2be5c] hover:text-[#254159]"
                            onClick={toggleForm}
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>

                {/* Show verification message if applicable */}
                {verificationSent && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-md">
                        <h3 className="font-medium">Verification email sent!</h3>
                        <p className="text-sm mt-1">
                            We've sent a verification email to <span className="font-semibold">{verificationEmail}</span>.
                            Please check your inbox and spam folder, then click the verification link before logging in.
                        </p>
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={loading}
                                className="text-sm text-green-700 underline hover:text-green-900 disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Resend verification email"}
                            </button>
                        </div>
                    </div>
                )}

                {!isLogin && !verificationSent && (
                    <div className="flex justify-center space-x-4">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-md transition-colors ${userType === "jobseeker"
                                ? "bg-[#f2be5c] text-white"
                                : "bg-[#F1D195] text-gray-800 hover:bg-[#f2be5c] hover:text-white"
                                }`}
                            onClick={() => {
                                setUserType("jobseeker");
                                setFieldErrors({});
                            }}
                        >
                            Job Seeker
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-md transition-colors ${userType === "business"
                                ? "bg-[#f2be5c] text-white"
                                : "bg-[#F1D195] text-gray-800 hover:bg-[#f2be5c] hover:text-white"
                                }`}
                            onClick={() => {
                                setUserType("business");
                                setFieldErrors({});
                            }}
                        >
                            Business
                        </button>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-4 rounded-md border border-red-200">
                        <div className="font-medium">Error</div>
                        <div>{error}</div>
                    </div>
                )}

                {/* Show the form when verification is not yet sent or when in login mode */}
                {(!verificationSent || isLogin) && (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                        <div className="rounded-md shadow-sm space-y-4">
                            {/* Conditional fields based on form type */}
                            {!isLogin && userType === "jobseeker" && (
                                <div>
                                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="full-name"
                                        name="fullName"
                                        type="text"
                                        required
                                        className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm ${getInputBorderClass('fullName')}`}
                                        placeholder="John Smith"
                                        value={fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        onBlur={() => validateField('fullName', fullName)}
                                    />
                                    {renderFieldError('fullName')}
                                </div>
                            )}

                            {!isLogin && userType === "business" && (
                                <div>
                                    <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                                        Business Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="business-name"
                                        name="businessName"
                                        type="text"
                                        required
                                        className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm ${getInputBorderClass('businessName')}`}
                                        placeholder="ABC Childcare Center"
                                        value={businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                        onBlur={() => validateField('businessName', businessName)}
                                    />
                                    {renderFieldError('businessName')}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                    Email address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm ${getInputBorderClass('email')}`}
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onBlur={() => validateField('email', email)}
                                />
                                {renderFieldError('email')}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    required
                                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm ${getInputBorderClass('password')}`}
                                    placeholder={isLogin ? "Your password" : "Create a password"}
                                    value={password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    onBlur={() => validateField('password', password)}
                                />
                                {renderFieldError('password')}
                                {!isLogin && (
                                    <div className="mt-1 text-xs text-gray-500">
                                        Password must be at least 6 characters with letters and numbers
                                    </div>
                                )}
                            </div>

                            {!isLogin && (
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm ${getInputBorderClass('confirmPassword')}`}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        onBlur={() => validateField('confirmPassword', confirmPassword)}
                                    />
                                    {renderFieldError('confirmPassword')}
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#254159] ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#f2be5c]"
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    isLogin ? "Sign in" : "Sign up"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Show a switch to login form button when verification sent */}
                {verificationSent && (
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(true);
                                setVerificationSent(false);
                            }}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#254159] hover:bg-[#f2be5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Continue to Login
                        </button>
                    </div>
                )}
            </div>
            <div className="hidden md:block">
                <img src="/images/login2ndhalf.png" className="bg-no-repeat max-w-s max-h-250" alt="Decorative" />
            </div>
        </div>
    );
}

export default AuthPage;