import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { db, functions } from "../../../firebase/config";
import { httpsCallable } from 'firebase/functions';
import { loadStripe } from "@stripe/stripe-js";
import BusinessNavigation from "../components/BusinessNavigation";
import { doc, getDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import AccountSettingsModal from "./AccountSettingsModal";

// Load Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Available token packages
const tokenPackages = [
    { name: 'Starter Package', priceId: 'price_1RGXhmImJbNXSMjuXNhnXb2O', tokens: 100, cost: '$50.00 AUD' },
    { name: 'Growth Package', priceId: 'price_1RGXjCImJbNXSMjuDqg6VThr', tokens: 250, cost: '$100.00 AUD' },
    { name: 'Scale Package', priceId: 'price_1RGXlpImJbNXSMjuHllUyvFY', tokens: 600, cost: '$200.00 AUD' },
    { name: 'Elite Package', priceId: 'price_1RGXoBImJbNXSMjujfAWbLxx', tokens: 1500, cost: '$450.00 AUD' },
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
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // New state for modal

    // Load token balance once on component mount
    useEffect(() => {
        const fetchTokenBalance = async () => {
            setLocalLoading(true);
            if (currentUser) {
                try {
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

    // Function to fetch transactions
    const fetchTransactionsData = useCallback(async () => {
        if (!currentUser) {
            setTransactions([]); // Clear transactions if no user
            // No limit here, it's inside the query, but we are enforcing it
            return;
        }

        setLoadingTransactions(true);
        try {
            const transactionReference = collection(db, 'users', currentUser.uid, 'transactions');
            const transactionQuery = query(
                transactionReference,
                orderBy('purchaseDate', 'desc'),
                limit(50) // Limited to 50 Documents at a time
            );

            const querySnapshot = await getDocs(transactionQuery);
            const transactionsList = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                transactionsList.push({
                    id: docSnap.id,
                    type: data.type || 'unknown',
                    amount: data.amount || 0,
                    timestamp: data.purchaseDate?.toDate() || new Date(),
                    status: data.status || 'completed',
                    details: data.description || ''
                });
            });
            setTransactions(transactionsList);
            setError(''); // Clear error if fetch is successful
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Could not retrieve transaction history. Please try again later.");
            setTransactions([]); // Clear transactions on error
        } finally {
            setLoadingTransactions(false);
        }
    }, [currentUser]); // Dependencies for useCallback

    // Fetch Transactions on component mount or when currentUser changes
    useEffect(() => {
        fetchTransactionsData();
    }, [fetchTransactionsData]); // fetchTransactionsData is memoized

    // Handle token purchase
    const handlePurchase = async (priceId) => {
        if (!currentUser) {
            setError('Please log in before making a purchase.');
            return;
        }
        if (!priceId || typeof priceId !== 'string') {
            setError("Invalid package selection.");
            return;
        }
        setLoadingPackageId(priceId);
        setError('');
        try {
            const { data } = await callFunction('createCheckoutSession', { priceId });
            const sessionId = data?.id;
            if (!sessionId) throw new Error("Invalid response from server.");
            const stripe = await stripePromise;
            if (!stripe) throw new Error("Stripe failed to load.");
            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
            if (stripeError) throw new Error(`Stripe error: ${stripeError.message}`);
        } catch (err) {
            setError(err.message || 'An unknown error occurred.');
        } finally { // Ensure loadingPackageId is reset even if redirectToCheckout is called
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
                    <div className="flex justify-between items-center mb-8"> {/* Added container for title and button */}
                        <h2 className="text-3xl font-bold text-[#254159] text-center md:text-left">Credit Management</h2>
                        {isBusiness && ( // Only show settings button for business users
                            <button
                                onClick={() => setIsSettingsModalOpen(true)}
                                className="ml-4 px-4 py-2 bg-[#254159] text-white rounded-md shadow-sm hover:bg-[#f2be5c] hover:text-[#254159] transition-colors duration-200 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Account Settings
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-md shadow-sm" role="alert">
                            <p className="font-bold">An Error Occurred</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-xl font-semibold text-[#254159]">Current Balance</h3>
                            <div className="text-4xl font-bold text-[#f2be5c]">
                                {tokenBalance} <span className="text-xl text-gray-600 font-medium">Credits</span>
                            </div>
                        </div>
                        <p className="text-gray-500 mt-3 text-sm text-center md:text-left">
                            Use Credits to unlock premium features like revealing jobseeker contact details.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                        <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Purchase Credits</h3>
                        <p className="text-gray-600 mb-6">
                            Select a package below. Payments are securely processed via Stripe Checkout.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {tokenPackages.map((pkg) => (
                                <div key={pkg.priceId} className="border border-gray-200 rounded-lg p-5 bg-gray-50 flex flex-col justify-between shadow hover:shadow-xl transform transition hover:-translate-y-1 duration-300 ease-in-out group">
                                    <div className="text-center flex-grow mb-4">
                                        <div className="text-lg font-semibold text-[#254159] mb-1 group-hover:text-[#f2be5c] transition-colors">{pkg.name}</div>
                                        <div className="text-5xl font-extrabold text-[#f2be5c] my-3">{pkg.tokens}</div>
                                        <div className="text-gray-500 text-sm mb-3 uppercase tracking-wide">Credits</div>
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

                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Transaction History</h3>
                        <h4 className="text-xs text-gray-500 mt-6 gap-1 pb-3">Fetching up to 50 records at a time.</h4>
                        {loadingTransactions ? (
                            <div className="flex justify-center items-center py-10">
                                <svg className="animate-spin h-8 w-8 text-[#254159]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="ml-3 text-gray-600">Loading transactions...</p>
                            </div>
                        ) : (
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
                                        {transactions.length > 0 ? (
                                            transactions.map((transaction) => (
                                                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {transaction.timestamp instanceof Date
                                                            ? transaction.timestamp.toLocaleDateString()
                                                            : 'Invalid date'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'purchase' ? 'bg-green-100 text-green-800' :
                                                            transaction.type === 'used' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800' // Default/unknown type
                                                            }`}>
                                                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
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
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 italic">
                                                    {error && error.includes("transaction history") ? 'Error loading transactions.' : 'No transaction history available yet.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="flex justify-center mt-4 pb-2">
                                    <button
                                        onClick={fetchTransactionsData}
                                        disabled={loadingTransactions}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm ${loadingTransactions
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-[#254159] text-white hover:bg-[#1d3446] focus:outline-none focus:ring-2 focus:ring-[#254159]"
                                            }`}
                                    >
                                        {loadingTransactions ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Refreshing...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Refresh Transactions
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Account Settings Modal */}
            <AccountSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
        </div>
    );
};

export default TokenManagement;