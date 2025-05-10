import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";

const BusinessDetailPage = () => {
    const { businessId } = useParams();
    const [business, setBusiness] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
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
                    const businessData = {
                        id: businessDoc.id,
                        ...businessDoc.data()
                    };
                    setBusiness(businessData);

                    // Handles both arrays and object format, in case we need to stich back
                    let ratingsArray = [];
                    if (businessData.ratings) {
                        if (Array.isArray(businessData.ratings)) {
                            ratingsArray = businessData.ratings;
                        } else {
                            ratingsArray = Object.values(businessData.ratings);
                        }
                    }

                    // Calculate average rating if ratings exist
                    if (ratingsArray.length > 0) {
                        const sum = ratingsArray.reduce((a, b) => a + b, 0);
                        const avg = sum / ratingsArray.length;
                        setAverageRating(avg);
                        setTotalRatings(ratingsArray.length);
                    } else {
                        setAverageRating(0);
                        setTotalRatings(0);
                    }

                    if (currentUser?.uid && businessData.ratings && typeof businessData.ratings === 'object') {
                        setHasRated(businessData.ratings[currentUser.uid] !== undefined);
                    }

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
                console.error("Error submitting rating:", err);
                setError("Failed to submit rating. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessAndJobs();
    }, [businessId, currentUser]);

    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        if (business?.ratings && currentUser?.uid) {
            setHasRated(business.ratings[currentUser.uid] !== undefined);
        }
    }, [business, currentUser]);

    const handleRatingSubmit = async () => {
        if (!userRating || !businessId || !currentUser || hasRated) return;

        try {
            const businessRef = doc(db, "users", businessId);

            // Timestamps rating, security purposes
            await updateDoc(businessRef, {
                [`ratings.${currentUser.uid}`]: userRating,
                lastRatedAt: serverTimestamp() 
            });

            // Update local state
            const newRatings = {
                ...business?.ratings,
                [currentUser.uid]: userRating
            };

            const ratingsArray = Object.values(newRatings);
            const newAverage = ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length;

            setAverageRating(newAverage);
            setTotalRatings(ratingsArray.length);
            setHasRated(true);
            setUserRating(0);

        } catch (err) {
            console.error("Rating submission failed:", err);
            setError("Failed to submit rating");
        }
    };

    const handleGoBack = () => {
        navigate("/businesses");
    };

    const businessInfo = business?.businessInformation || {};

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <SeekerNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <button
                    onClick={handleGoBack}
                    className="mb-4 flex items-center text-[#254159] hover:text-[#f2be5c]"
                >
                    ← Back to Businesses
                </button>

                <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-3xl font-bold text-[#254159] mb-2">
                            {businessInfo.centreName || business?.businessName}
                        </h2>

                        {/* Rating Display */}
                        <div className="flex items-center mt-2 md:mt-0">
                            <div className="flex mr-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={`avg-${star}`}
                                        className={`text-2xl ${star <= Math.round(averageRating) ? 'text-[#f2be5c]' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-gray-600">
                                ({averageRating.toFixed(1)} · {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
                            </span>
                        </div>
                    </div>

                    {/* Rating Input Section */}
                    {currentUser?.uid !== businessId && !hasRated && (
                        <div className="mb-6 p-4 bg-[#F4EDE8] rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#254159] mb-2">Rate this center</h3>
                            <div className="flex items-center mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={`rate-${star}`}
                                        className={`text-2xl mx-1 focus:outline-none ${star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setUserRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                    >
                                        {star <= (hoverRating || userRating) ? '★' : '☆'}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleRatingSubmit}
                                disabled={!userRating}
                                className={`px-4 py-2 rounded-md text-white font-medium ${!userRating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f2be5c] hover:bg-[#e0ac4a]'}`}
                            >
                                Submit Rating
                            </button>
                        </div>
                    )}

                    {hasRated && (
                        <div className="mb-6 p-4 bg-[#F1E8CD] text-[#f2be5c] rounded-lg">
                            You've already rated this business
                        </div>
                    )}

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
                                    <div key={job.id} className="bg-[#F1EEEB] p-4 rounded-md shadow-sm border border-gray-200">
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
