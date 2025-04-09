import { Link } from "react-router-dom";

const BusinessCard = ({ business }) => {
    // Extract business information
    const businessInfo = business.businessInformation || {};

    return (
        <div className="bg-[#F1EEEB] border border-[#DDD] rounded-lg shadow-sm p-6 transition hover:shadow-md">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold text-[#254159] mb-2">
                        {businessInfo.centreName || business.businessName || "Unnamed Center"}
                    </h3>

                    <p className="text-sm text-gray-700 mb-1">
                        📍 <span className="font-medium">Location:</span> {businessInfo.centreAddress || "Address not provided"}
                    </p>

                    <p className="text-sm text-gray-700 mb-1">
                        📞 <span className="font-medium">Phone:</span> {businessInfo.centrePhone || "Phone not provided"}
                    </p>

                    <p className="text-sm text-gray-700 mb-1">
                        🏫 <span className="font-medium">Type:</span> {businessInfo.centreType ? businessInfo.centreType.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : "Type not specified"}
                    </p>

                    {businessInfo.acecqaRating && (
                        <p className="text-sm text-gray-700 mb-1">
                            ⭐ <span className="font-medium">Rating:</span> {businessInfo.acecqaRating}
                        </p>
                    )}
                </div>

                <div className="flex flex-col justify-between">
                    {businessInfo.staffToChildRatio && (
                        <p className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">Staff-to-Child Ratio:</span> {businessInfo.staffToChildRatio}
                        </p>
                    )}

                    <Link
                        to={`/businesses/${business.id}`}
                        className="px-4 py-2 bg-[#254159] text-white rounded-md hover:bg-[#f2be5c] transition-colors text-center mt-4"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {businessInfo.centreDescription && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {businessInfo.centreDescription.length > 150
                            ? `${businessInfo.centreDescription.substring(0, 150)}...`
                            : businessInfo.centreDescription}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BusinessCard;
