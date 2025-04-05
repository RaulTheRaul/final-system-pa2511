import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const BusinessSetup = () => {
    const { currentUser, userData, getUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        // Basic centre information
        centreName: userData?.businessName || "", // Use the business name from initial signup
        centreAddress: userData?.businessInformation?.centreAddress || "",
        centrePhone: userData?.businessInformation?.centrePhone || "",
        centreType: userData?.businessInformation?.centreType || "childcare",
        licenseNumber: userData?.businessInformation?.licenseNumber || "",
        centreDescription: userData?.businessInformation?.centreDescription || "",

        // Centre details
        operatingHours: userData?.businessInformation?.operatingHours || "",
        acecqaRating: userData?.businessInformation?.acecqaRating || "",
        teachingApproach: userData?.businessInformation?.teachingApproach || "play-based",
        centreCapacity: userData?.businessInformation?.centreCapacity || "",
        roomCount: userData?.businessInformation?.roomCount || "",
        staffToChildRatio: userData?.businessInformation?.staffToChildRatio || "",
        staffBenefits: Array.isArray(userData?.businessInformation?.staffBenefits)
            ? userData?.businessInformation?.staffBenefits.join(", ")
            : userData?.businessInformation?.staffBenefits || "",
        careerOpportunities: userData?.businessInformation?.careerOpportunities || "",
    });

    // Update form data if userData changes (such as during initial load)
    useEffect(() => {
        if (userData) {
            setFormData(prevData => ({
                ...prevData,
                centreName: userData.businessName || prevData.centreName
            }));
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        // Basic validation
        if (!formData.centreName || !formData.centreAddress || !formData.centrePhone) {
            setError("Please fill out all required fields");
            setLoading(false);
            return;
        }

        try {
            // Format data for Firestore with proper types
            const businessInformation = {
                // Basic centre information as strings
                centreName: formData.centreName,
                centreAddress: formData.centreAddress,
                centrePhone: formData.centrePhone,
                centreType: formData.centreType,
                licenseNumber: formData.licenseNumber,
                centreDescription: formData.centreDescription,

                // Centre details with appropriate types
                operatingHours: formData.operatingHours,
                acecqaRating: formData.acecqaRating,
                teachingApproach: formData.teachingApproach,

                // Convert string numbers to actual number type
                centreCapacity: formData.centreCapacity ? Number(formData.centreCapacity) : null,
                roomCount: formData.roomCount ? Number(formData.roomCount) : null,

                staffToChildRatio: formData.staffToChildRatio,

                // Convert comma-separated values to arrays
                staffBenefits: formData.staffBenefits
                    ? formData.staffBenefits.split(',').map(item => item.trim())
                    : [],

                careerOpportunities: formData.careerOpportunities,

                // Add timestamp for update tracking
                updatedAt: new Date()
            };

            // Update user document in Firestore with the nested businessInformation
            await setDoc(
                doc(db, "users", currentUser.uid),
                {
                    businessInformation,
                    setupCompleted: true
                },
                { merge: true }
            );

            // Refresh user data in context
            await getUserData(currentUser.uid);

            setSuccess(true);
            setError("");
        } catch (err) {
            console.error("Error updating centre details:", err);
            setError("Failed to update centre details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2ece4] p-4 md:p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
                <h1 className="text-2xl font-bold text-[#254159] mb-6">Complete Your Centre Profile</h1>
                <p className="text-gray-600 mb-6">
                    Before you can access the platform, please provide some important information about your centre.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
                        Centre profile successfully updated!
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        {/* Basic Centre Information Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Basic Centre Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="centreName" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Centre Name *
                                    </label>
                                    <input
                                        id="centreName"
                                        name="centreName"
                                        type="text"
                                        required
                                        value={formData.centreName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="centreAddress" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Centre Address *
                                    </label>
                                    <input
                                        id="centreAddress"
                                        name="centreAddress"
                                        type="text"
                                        required
                                        value={formData.centreAddress}
                                        onChange={handleChange}
                                        placeholder="123 Main Street, Suburb, State, Postcode"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="centrePhone" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Centre Phone *
                                    </label>
                                    <input
                                        id="centrePhone"
                                        name="centrePhone"
                                        type="tel"
                                        required
                                        value={formData.centrePhone}
                                        onChange={handleChange}
                                        placeholder="+61 x xxxx xxxx"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="centreType" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Centre Type *
                                    </label>
                                    <select
                                        id="centreType"
                                        name="centreType"
                                        required
                                        value={formData.centreType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="childcare">Childcare Center</option>
                                        <option value="long-day-care">Long Day Care</option>
                                        <option value="family-day-care">Family Day Care</option>
                                        <option value="outside-school-hours">Outside School Hours Care</option>
                                        <option value="preschool">Preschool/Kindergarten</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        License Number / Service Approval Number
                                    </label>
                                    <input
                                        id="licenseNumber"
                                        name="licenseNumber"
                                        type="text"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="operatingHours" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Operating Hours
                                    </label>
                                    <input
                                        id="operatingHours"
                                        name="operatingHours"
                                        type="text"
                                        value={formData.operatingHours}
                                        onChange={handleChange}
                                        placeholder="e.g., Monday-Friday: 7am-6pm"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="acecqaRating" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        ACECQA Rating
                                    </label>
                                    <select
                                        id="acecqaRating"
                                        name="acecqaRating"
                                        value={formData.acecqaRating}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Rating</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Exceeding">Exceeding National Quality Standard</option>
                                        <option value="Meeting">Meeting National Quality Standard</option>
                                        <option value="Working Towards">Working Towards National Quality Standard</option>
                                        <option value="Significant Improvement">Significant Improvement Required</option>
                                        <option value="Not Yet Assessed">Not Yet Assessed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Workplace Details Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Workplace Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="teachingApproach" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Teaching Approach
                                    </label>
                                    <select
                                        id="teachingApproach"
                                        name="teachingApproach"
                                        value={formData.teachingApproach}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="play-based">Play-Based Learning</option>
                                        <option value="reggio-emilia">Reggio Emilia</option>
                                        <option value="montessori">Montessori</option>
                                        <option value="steiner">Steiner/Waldorf</option>
                                        <option value="eylf">Early Years Learning Framework</option>
                                        <option value="multiple">Multiple Approaches</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="centreCapacity" className="block text-sm font-medium text-[#0d1826] mb-1">
                                            Centre Capacity (Children)
                                        </label>
                                        <input
                                            id="centreCapacity"
                                            name="centreCapacity"
                                            type="number"
                                            min="0"
                                            value={formData.centreCapacity}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="roomCount" className="block text-sm font-medium text-[#0d1826] mb-1">
                                            Number of Rooms
                                        </label>
                                        <input
                                            id="roomCount"
                                            name="roomCount"
                                            type="number"
                                            min="0"
                                            value={formData.roomCount}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="staffToChildRatio" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Staff-to-Child Ratios
                                    </label>
                                    <input
                                        id="staffToChildRatio"
                                        name="staffToChildRatio"
                                        type="text"
                                        value={formData.staffToChildRatio}
                                        onChange={handleChange}
                                        placeholder="e.g., 1:4 for infants, 1:5 for toddlers"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="staffBenefits" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Staff Benefits
                                    </label>
                                    <input
                                        id="staffBenefits"
                                        name="staffBenefits"
                                        type="text"
                                        value={formData.staffBenefits}
                                        onChange={handleChange}
                                        placeholder="e.g., Professional development, Staff discounts, Flexible hours"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple benefits with commas</p>
                                </div>

                                <div>
                                    <label htmlFor="careerOpportunities" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Career Progression Opportunities
                                    </label>
                                    <textarea
                                        id="careerOpportunities"
                                        name="careerOpportunities"
                                        rows="3"
                                        value={formData.careerOpportunities}
                                        onChange={handleChange}
                                        placeholder="Describe career advancement opportunities at your centre"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="centreDescription" className="block text-sm font-medium text-[#0d1826] mb-1">
                                        Centre Description *
                                    </label>
                                    <textarea
                                        id="centreDescription"
                                        name="centreDescription"
                                        rows="4"
                                        required
                                        value={formData.centreDescription}
                                        onChange={handleChange}
                                        placeholder="Tell us about your centre, its philosophy, culture, and what makes it special..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#254159] hover:bg-[#f2be5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Saving..." : "Save and Continue"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessSetup;