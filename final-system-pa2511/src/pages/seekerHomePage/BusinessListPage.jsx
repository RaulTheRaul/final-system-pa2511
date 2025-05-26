import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";
import BusinessCard from "./components/BusinessCard";

const BusinessListPage = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!currentUser) return;

            setLoading(true);
            try {
                // Query users collection for documents where userType = "business"
                const businessQuery = query(
                    collection(db, "users"),
                    where("userType", "==", "business"),
                    where("setupCompleted", "==", true)
                );

                const querySnapshot = await getDocs(businessQuery);
                const businessesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,  // This is the Firebase user ID which we'll use as businessId
                    ...doc.data()
                }));

                setBusinesses(businessesData);
                setError("");
            } catch (err) {
                console.error("Error fetching businesses:", err);
                setError("Failed to load business listings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [currentUser]);

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <SeekerNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-[#F8F8F8] rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold text-[#254159] mb-6">Childcare Centers</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search and Filter"
                                className="py-1 pl-5 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-transparent"
                            />
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading childcare centers...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md">
                            {error}
                        </div>
                    ) : businesses.length === 0 ? (
                        <div className="text-center py-8 bg-[#F1EEEB] rounded-lg">
                            <p className="text-gray-600">No childcare centers available at this time.</p>
                            <p className="text-gray-500 text-sm mt-2">Check back later for new listings.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {businesses.map(business => (
                                <BusinessCard key={business.id} business={business} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessListPage;
