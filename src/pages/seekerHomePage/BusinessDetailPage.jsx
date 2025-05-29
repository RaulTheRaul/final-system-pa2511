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
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const getLogoUrl = () => {
        return business?.businessInformation?.logoUrl || '';
    };

    const getCentreImageUrls = () => {
        return business?.businessInformation?.centreImageUrls || [];
    };

    // Ratings state for each category
    const [userRatings, setUserRatings] = useState({
        workplaceCulture: 0,
        wagesBenefits: 0,
        professionalDevelopment: 0,
        leadership: 0,
        inclusionSupport: 0
    });

    const [hoverRatings, setHoverRatings] = useState({
        workplaceCulture: 0,
        wagesBenefits: 0,
        professionalDevelopment: 0,
        leadership: 0,
        inclusionSupport: 0
    });

    const [averageRatings, setAverageRatings] = useState({
        workplaceCulture: 0,
        wagesBenefits: 0,
        professionalDevelopment: 0,
        leadership: 0,
        inclusionSupport: 0
    });

    const [totalRatings, setTotalRatings] = useState({
        workplaceCulture: 0,
        wagesBenefits: 0,
        professionalDevelopment: 0,
        leadership: 0,
        inclusionSupport: 0
    });

    const [hasRated, setHasRated] = useState({
        workplaceCulture: false,
        wagesBenefits: false,
        professionalDevelopment: false,
        leadership: false,
        inclusionSupport: false
    });

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

                    // Initialize all rating categories
                    const ratingCategories = [
                        'workplaceCulture',
                        'wagesBenefits',
                        'professionalDevelopment',
                        'leadership',
                        'inclusionSupport'
                    ];

                    const newAverageRatings = {};
                    const newTotalRatings = {};
                    const newHasRated = {};

                    ratingCategories.forEach(category => {
                        // Handles both arrays and object format
                        let ratingsArray = [];
                        if (businessData.ratings && businessData.ratings[category]) {
                            if (Array.isArray(businessData.ratings[category])) {
                                ratingsArray = businessData.ratings[category];
                            } else {
                                ratingsArray = Object.values(businessData.ratings[category]);
                            }
                        }

                        // Calculate average rating if ratings exist
                        if (ratingsArray.length > 0) {
                            const sum = ratingsArray.reduce((a, b) => a + b, 0);
                            const avg = sum / ratingsArray.length;
                            newAverageRatings[category] = avg;
                            newTotalRatings[category] = ratingsArray.length;
                        } else {
                            newAverageRatings[category] = 0;
                            newTotalRatings[category] = 0;
                        }

                        // Check if user has rated this category
                        if (currentUser?.uid && businessData.ratings && businessData.ratings[category]) {
                            newHasRated[category] = businessData.ratings[category][currentUser.uid] !== undefined;
                        } else {
                            newHasRated[category] = false;
                        }
                    });

                    setAverageRatings(prev => ({ ...prev, ...newAverageRatings }));
                    setTotalRatings(prev => ({ ...prev, ...newTotalRatings }));
                    setHasRated(prev => ({ ...prev, ...newHasRated }));

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

    const handleRatingSubmit = async (category) => {
        const ratingValue = userRatings[category];
        if (!ratingValue || !businessId || !currentUser || hasRated[category]) return;

        try {
            const businessRef = doc(db, "users", businessId);

            // Update the specific rating category
            await updateDoc(businessRef, {
                [`ratings.${category}.${currentUser.uid}`]: ratingValue,
                lastRatedAt: serverTimestamp()
            });

            // Update local state
            const newRatings = {
                ...business?.ratings,
                [category]: {
                    ...(business?.ratings?.[category] || {}),
                    [currentUser.uid]: ratingValue
                }
            };

            const ratingsArray = Object.values(newRatings[category] || {});
            const newAverage = ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length;

            setAverageRatings(prev => ({ ...prev, [category]: newAverage }));
            setTotalRatings(prev => ({ ...prev, [category]: ratingsArray.length }));
            setHasRated(prev => ({ ...prev, [category]: true }));
            setUserRatings(prev => ({ ...prev, [category]: 0 }));

        } catch (err) {
            console.error("Rating submission failed:", err);
            setError("Failed to submit rating");
        }
    };

    const handleRatingChange = (category, value) => {
        setUserRatings(prev => ({ ...prev, [category]: value }));
    };

    const handleHoverRating = (category, value) => {
        setHoverRatings(prev => ({ ...prev, [category]: value }));
    };

    const handleGoBack = () => {
        navigate("/businesses");
    };

    const businessInfo = business?.businessInformation || {};

    // Helper function to render rating input for a category
    const renderRatingInput = (category, label) => {
        return (
            <div className="grid items-center sm:grid-cols-3 mb-6 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-[#254159] mb-2">Rate {label}</h3>
                <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={`${category}-${star}`}
                            className={`text-4xl mx-1 focus:outline-none ${star <= (hoverRatings[category] || userRatings[category]) ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => handleRatingChange(category, star)}
                            onMouseEnter={() => handleHoverRating(category, star)}
                            onMouseLeave={() => handleHoverRating(category, 0)}
                            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        >
                            {star <= (hoverRatings[category] || userRatings[category]) ? '★' : '☆'}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => handleRatingSubmit(category)}
                    disabled={!userRatings[category]}
                    className={`px-4 py-2 rounded-md text-white font-medium ${!userRatings[category] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f2be5c] hover:bg-[#e0ac4a]'}`}
                >
                    Submit Rating
                </button>
            </div>
        );
    };

    // Helper function to render rating display for a category
    const renderRatingDisplay = (category, label) => {
        return (
            <div className="flex flex-col items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
                <span className="font-medium text-2xl text-[#254159]">{label}</span>
                <div className="flex flex-col items-center">
                    <span className="text-gray-600 text-sm font-bold mb-1">
                        Average: {averageRatings[category].toFixed(1)} · Total: {totalRatings[category]} {totalRatings[category] === 1 ? 'rating' : 'ratings'}
                    </span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={`${category}-avg-${star}`}
                                className={`text-6xl ${star <= Math.round(averageRatings[category]) ? 'text-[#f2be5c]' : 'text-gray-300'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

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

                <div className="bg-[#F8F8F8] rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-3xl font-bold text-[#254159] mb-2">
                            {businessInfo.centreName || business?.businessName}
                        </h2>
                    </div>

                    {/* Detailed Ratings Display */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-[#254159] mb-4">Center Ratings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderRatingDisplay('workplaceCulture', 'Workplace Culture')}
                            {renderRatingDisplay('wagesBenefits', 'Wages & Benefits')}
                            {renderRatingDisplay('professionalDevelopment', 'Professional Development')}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {renderRatingDisplay('leadership', 'Leadership')}
                            {renderRatingDisplay('inclusionSupport', 'Inclusion Support')}
                        </div>
                    </div>

                    {/* Rating Input Sections */}
                    {currentUser?.uid !== businessId && (
                        <div className="space-y-4 mb-6">
                            {!hasRated.workplaceCulture && renderRatingInput('workplaceCulture', 'Workplace Culture')}
                            {!hasRated.wagesBenefits && renderRatingInput('wagesBenefits', 'Wages & Benefits')}
                            {!hasRated.professionalDevelopment && renderRatingInput('professionalDevelopment', 'Professional Development')}
                            {!hasRated.leadership && renderRatingInput('leadership', 'Leadership')}
                            {!hasRated.inclusionSupport && renderRatingInput('inclusionSupport', 'Inclusion Support')}
                        </div>
                    )}

                    {/* Display if user has rated all categories */}
                    {hasRated.workplaceCulture && hasRated.wagesBenefits &&
                        hasRated.professionalDevelopment && hasRated.leadership && hasRated.inclusionSupport && (
                            <div className="mb-6 p-4 bg-[#F1E8CD] text-[#f2be5c] rounded-lg">
                                You've already rated this business
                            </div>
                        )}

                    {/* Business Logo Display */}
                    {getLogoUrl() && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 flex items-center justify-center">
                            <img src={getLogoUrl()} alt="Business Logo" className="max-h-32 object-contain" />
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
                                    <span className="font-medium w-32">Capacity:</span>
                                    <span>{businessInfo.centreCapacity ? `${businessInfo.centreCapacity} children` : "Not specified"}</span>
                                </p>

                                <p className="flex items-start">
                                    <span className="font-medium w-32">Staff Ratios Provided:</span>
                                    <span>{businessInfo.staffToChildRatio || "Not specified"}</span>
                                </p>


                            </div>
                        </div>
                    </div>

                    {businessInfo.centreDescription && (
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="text-xl font-semibold text-[#254159] mb-4">About Us</h3>
                            <div className="space-y-6">
                                <div className="text-gray-700 whitespace-pre-line">
                                    {businessInfo.centreDescription}
                                </div>

                                <hr className="my-6" />

                                {/* Staff Benefits Section */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#254159] mb-2">Staff Benefits</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(businessInfo.staffBenefits) && businessInfo.staffBenefits.length > 0 ? (
                                            businessInfo.staffBenefits.map((benefit, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-[#f2be5c] bg-opacity-20 border border-[#f2be5c] text-[#254159] px-3 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-colors"
                                                >
                                                    {benefit}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">No staff benefits listed.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <hr className="my-6" />

                    {/* Centre Images Display */}
                    {getCentreImageUrls().length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-[#254159] mb-4">Centre Photos</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getCentreImageUrls().map((url, index) => (
                                    <div key={index} className="w-full aspect-video rounded-md overflow-hidden shadow-sm border border-gray-200">
                                        <img src={url} alt={`Centre photo ${index + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
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
