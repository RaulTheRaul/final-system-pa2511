import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";

const BusinessDetailPage = () => {
    const { businessId } = useParams();
    const [business, setBusiness] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBusinessAndJobs = async () => {
            if (!currentUser || !businessId) return;

            setLoading(true);
            try {
                // Fetch business data
                const businessDoc = await getDoc(doc(db, "users", businessId));

                if (businessDoc.exists()) {
                    setBusiness({
                        id: businessDoc.id,
                        ...businessDoc.data()
                    });

                    // Fetch jobs posted by this business using the user ID as businessId
                    const jobsQuery = query(
                        collection(db, "jobs"),
                        where("businessId", "==", businessId)
                    );

                    const jobsSnapshot = await getDocs(jobsQuery);
                    const jobsData = jobsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setJobs(jobsData);
                } else {
                    setError("Business not found");
                }
            } catch (err) {
                console.error("Error fetching business details:", err);
                setError("Failed to load business details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessAndJobs();
    }, [businessId, currentUser]);

    const handleGoBack = () => {
        navigate("/businesses");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f2ece4]">
                <SeekerNavigation />
                <div className="max-w-6xl mx-auto p-6">
                    <div className="text-center py-8">
                        <p className="text-gray-600">Loading business details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="min-h-screen bg-[#f2ece4]">
                <SeekerNavigation />
                <div className="max-w-6xl mx-auto p-6">
                    <div className="bg-red-50 text-red-600 p-4 rounded-md">
                        {error || "Business not found"}
                    </div>
                    <button
                        onClick={handleGoBack}
                        className="mt-4 px-4 py-2 bg-[#284566] text-white rounded-md hover:bg-[#1f364d] transition-colors"
                    >
                        Back to Businesses
                    </button>
                </div>
            </div>
        );
    }

    const businessInfo = business.businessInformation || {};

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <SeekerNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <button
                    onClick={handleGoBack}
                    className="mb-4 flex items-center text-[#254159] hover:text-[#1f364d]"
                >
                    ← Back to Businesses
                </button>

                <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-3xl font-bold text-[#254159] mb-2">
                        {businessInfo.centreName || business.businessName}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <h3 className="text-xl font-semibold text-[#254159] mb-4">Center Information</h3>

                            <div className="space-y-3">
                                <p className="flex items-start">
                                    <span className="font-medium w-32">Address:</span>
                                    <span>{businessInfo.centreAddress || "Not provided"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">Phone:</span>
                                    <span>{businessInfo.centrePhone || "Not provided"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">Type:</span>
                                    <span>{businessInfo.centreType ? businessInfo.centreType.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : "Not specified"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">License:</span>
                                    <span>{businessInfo.licenseNumber || "Not provided"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">Hours:</span>
                                    <span>{businessInfo.operatingHours || "Not provided"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">ACECQA Rating:</span>
                                    <span>{businessInfo.acecqaRating || "Not provided"}</span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-[#254159] mb-4">Center Details</h3>

                            <div className="space-y-3">
                                <p className="flex items-start">
                                    <span className="font-medium w-32">Approach:</span>
                                    <span>{businessInfo.teachingApproach ? businessInfo.teachingApproach.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : "Not specified"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">Capacity:</span>
                                    <span>{businessInfo.centreCapacity ? `${businessInfo.centreCapacity} children` : "Not specified"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">Rooms:</span>
                                    <span>{businessInfo.roomCount || "Not specified"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">Ratio:</span>
                                    <span>{businessInfo.staffToChildRatio || "Not specified"}</span>
                                </p>

                                {businessInfo.staffBenefits && businessInfo.staffBenefits.length > 0 && (
                                    <div className="flex items-start">
                                        <span className="font-medium w-32">Staff Benefits:</span>
                                        <span>{businessInfo.staffBenefits.join(", ")}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {businessInfo.centreDescription && (
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="text-xl font-semibold text-[#254159] mb-4">About Us</h3>
                            <p className="text-gray-700 whitespace-pre-line">{businessInfo.centreDescription}</p>
                        </div>
                    )}

                    {businessInfo.careerOpportunities && (
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="text-xl font-semibold text-[#254159] mb-4">Career Opportunities</h3>
                            <p className="text-gray-700 whitespace-pre-line">{businessInfo.careerOpportunities}</p>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t">
                        <h3 className="text-xl font-semibold text-[#254159] mb-4">Current Job Openings</h3>

                        {jobs.length === 0 ? (
                            <p className="text-gray-600">No current job openings at this center.</p>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map(job => (
                                    <div key={job.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                        <h4 className="text-lg font-semibold text-[#254159]">{job.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                                        <Link
                                            to={`/seeker/jobs/${job.id}`}
                                            className="text-[#f2be5c] hover:text-[#26425A] font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetailPage;