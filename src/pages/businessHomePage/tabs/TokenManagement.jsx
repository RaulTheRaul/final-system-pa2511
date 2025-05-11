import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { db, functions } from "../../../firebase/config";
import { httpsCallable } from 'firebase/functions';
import { loadStripe } from "@stripe/stripe-js";
import BusinessNavigation from "../components/BusinessNavigation";
import { doc, getDoc } from 'firebase/firestore'; // Using get getDoc just to load the balance everytime page refreshes 

// Load Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Available token packages
const tokenPackages = [
    { name: 'Starter Package', priceId: 'price_1RGXhmImJbNXSMjuXNhnXb2O', tokens: 100, cost: '$50.00 AUD' },
    { name: 'Growth Package', priceId: 'price_1RGXjCImJbNXSMjuDqg6VThr', tokens: 250, cost: '$100.00 AUD' },
    { name: 'Scale Package', priceId: 'price_1RGXlpImJbNXSMjuHllUyvFY', tokens: 600, cost: '$200.00 AUD' },
    { name: 'Elite Package', priceId: 'price_1RGXoBImJbNXSMjujfAWbLxx', tokens: 1500, cost: '$450.00 AUD' },
];

// Example transaction data
const EXAMPLE_TRANSACTIONS = [
    { id: "example1", type: "purchase", amount: 100, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: "completed", details: "Starter Package" },
    { id: "example2", type: "used", amount: -1, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: "completed", details: "Revealed contact for Jane D." }
];

// Helper to call Cloud Functions
const callFunction = async (functionName, data) => {
    if (!functions) {
        throw new Error("Functions service unavailable");
    }

    try {
        const callable = httpsCallable(functions, functionName);
        const result = await callable(data);
        return result;
    } catch (error) {
        // Format error message
        let message = `Failed to call function ${functionName}`;
        if (error instanceof Error) message = error.message;
        if (error.details?.message) message = error.details.message;
        if (error.code === 'unauthenticated') message = "Authentication failed";

        throw new Error(message);
    }
}

// Main Component
const TokenManagement = () => {
    const { currentUser, userData, loading: authLoading } = useAuth();
    const [loadingPackageId, setLoadingPackageId] = useState(null);
    const [error, setError] = useState('');
    const [tokenBalance, setTokenBalance] = useState(0);
    const [localLoading, setLocalLoading] = useState(true);

    // Load token balance once on component mount
    useEffect(() => {
        const fetchTokenBalance = async () => {
            setLocalLoading(true);

            if (currentUser) {
                try {
                    // One-time data fetch instead of real-time listener
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(userDocRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setTokenBalance(data.tokenBalance || 0);
                    } else {
                        setTokenBalance(0);
                    }
                } catch (err) {
                    console.error("Error fetching token balance:", err);
                    setError("Could not retrieve token balance. Please refresh.");
                    setTokenBalance(0);
                } finally {
                    setLocalLoading(false);
                }
            } else {
                setTokenBalance(0);
                setLocalLoading(false);
            }
        };

        fetchTokenBalance();
    }, [currentUser]);

    // Handle token purchase
    const handlePurchase = async (priceId) => {
        // Auth check
        if (!currentUser) {
            setError('Please log in before making a purchase.');
            return;
        }

        // Validate price ID
        if (!priceId || typeof priceId !== 'string') {
            setError("Invalid package selection.");
            return;
        }

        setLoadingPackageId(priceId);
        setError('');

        try {
            // Call Cloud Function to create checkout session
            const { data } = await callFunction('createCheckoutSession', { priceId });
            const sessionId = data?.id;

            if (!sessionId) {
                throw new Error("Invalid response from server.");
            }

            // Load Stripe and redirect to checkout
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error("Stripe failed to load.");
            }

            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

            if (stripeError) {
                throw new Error(`Stripe error: ${stripeError.message}`);
            }

        } catch (err) {
            setError(err.message || 'An unknown error occurred.');
            setLoadingPackageId(null);
        }
    };

    // Loading state
    if (authLoading || localLoading) {
        return (
            <div className="min-h-screen bg-[#f2ece4] flex items-center justify-center">
                <BusinessNavigation />
                <div className="flex flex-col items-center p-10">
                    <svg className="animate-spin h-12 w-12 text-[#254159]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-medium text-[#254159] mt-4">Loading User Data...</p>
                </div>
            </div>
        );
    }

    // User not logged in
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-[#f2ece4]">
                <BusinessNavigation />
                <div className="text-center p-10">
                    <h3 className="text-xl text-gray-700 font-semibold">Access Denied</h3>
                    <p className="mt-2 text-gray-600">Please log in to manage your tokens.</p>
                </div>
            </div>
        );
    }

    // Non-business user check
    const isBusiness = userData?.userType === 'business';
    if (currentUser && userData && !isBusiness) {
        return (
            <div className="min-h-screen bg-[#f2ece4]">
                <BusinessNavigation />
                <div className="text-center p-10">
                    <h3 className="text-xl text-gray-700 font-semibold">Feature Unavailable</h3>
                    <p className="mt-2 text-gray-600">Token management is only available for business accounts.</p>
                </div>
            </div>
        );
    }

    // Loading user data type
    if (currentUser && !userData && !localLoading) {
        return (
            <div className="min-h-screen bg-[#f2ece4]">
                <BusinessNavigation />
                <div className="text-center p-10">
                    <p className="text-gray-600">Verifying account type...</p>
                </div>
            </div>
        );
    }

    // Main component UI
    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <BusinessNavigation />
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-[#F8F8F8] rounded-xl shadow-xl p-6 md:p-8 border border-gray-200">
                    <h2 className="text-3xl font-bold text-[#254159] mb-8 text-center md:text-left">Token Management</h2>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-md shadow-sm" role="alert">
                            <p className="font-bold">An Error Occurred</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Current Balance Card */}
                    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-xl font-semibold text-[#254159]">Current Balance</h3>
                            <div className="text-4xl font-bold text-[#f2be5c]">
                                {tokenBalance} <span className="text-xl text-gray-600 font-medium">Tokens</span>
                            </div>
                        </div>
                        <p className="text-gray-500 mt-3 text-sm text-center md:text-left">
                            Use tokens to unlock premium features like revealing jobseeker contact details.
                        </p>
                    </div>

                    {/* Purchase Tokens Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                        <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Purchase Tokens</h3>
                        <p className="text-gray-600 mb-6">
                            Select a package below. Payments are securely processed via Stripe Checkout.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {tokenPackages.map((pkg) => (
                                <div key={pkg.priceId} className="border border-gray-200 rounded-lg p-5 bg-gray-50 flex flex-col justify-between shadow hover:shadow-xl transform transition hover:-translate-y-1 duration-300 ease-in-out group">
                                    <div className="text-center flex-grow mb-4">
                                        <div className="text-lg font-semibold text-[#254159] mb-1 group-hover:text-[#f2be5c] transition-colors">{pkg.name}</div>
                                        <div className="text-5xl font-extrabold text-[#f2be5c] my-3">{pkg.tokens}</div>
                                        <div className="text-gray-500 text-sm mb-3 uppercase tracking-wide">Tokens</div>
                                        <div className="text-xl font-semibold text-gray-800">{pkg.cost}</div>
                                    </div>
                                    <button
                                        onClick={() => handlePurchase(pkg.priceId)}
                                        disabled={loadingPackageId === pkg.priceId}
                                        className={`w-full mt-auto px-4 py-2 text-sm font-medium text-white rounded-md transition duration-150 ease-in-out shadow-md flex items-center justify-center ${loadingPackageId === pkg.priceId
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#254159] hover:bg-[#f2be5c] hover:text-[#254159] focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:ring-opacity-50"
                                            }`}
                                    >
                                        {loadingPackageId === pkg.priceId ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : "Buy Now"}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-6 text-center flex items-center justify-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Payments processed securely by Stripe. Card details are not stored on our servers.
                        </p>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Transaction History</h3>
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md shadow-sm text-sm" role="alert">
                            <p><span className="font-bold">Note:</span> Transaction history below is example data. To see real transactions, the backend logging needs to be fully implemented in the webhook.</p>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {EXAMPLE_TRANSACTIONS.length > 0 ? (
                                        EXAMPLE_TRANSACTIONS.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.timestamp.toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'purchase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {transaction.type === 'purchase' ? 'Purchase' : 'Used'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                    <span className={transaction.amount > 0 ? 'text-green-700' : 'text-red-700'}>
                                                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate" title={transaction.details || ''}>
                                                    {transaction.details || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 italic">No transaction history available yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenManagement;