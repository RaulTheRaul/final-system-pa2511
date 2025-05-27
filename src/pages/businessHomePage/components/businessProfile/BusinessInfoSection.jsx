import React from "react";

const BusinessInfoSection = ({ formData, handleChange, handleCheckboxChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#254159] mb-6 border-b border-gray-300 pb-3">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"> {/*Input to change business name*/}
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="businessName"
                        name="businessName"
                        maxLength={100}
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Please provide business name."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.businessName?.length || 0}/100 characters
                    </p>
                </div>

                <div> {/*Input to change business aceqca*/}
                    <label htmlFor="aceqcaRating" className="block text-sm font-medium text-gray-700 mb-2">
                        ACECQA Rating
                    </label>
                    <select
                        id="aceqcaRating"
                        name="aceqcaRating"
                        value={formData.aceqcaRating}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors bg-white"
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

                <div> {/*Input for license number*/}
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Approved Provider License
                    </label>
                    <input
                        id="licenseNumber"
                        name="licenseNumber"
                        maxLength={20}
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        placeholder="Enter your approved provider license number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.licenseNumber?.length || 0}/20 characters - Enter your ACECQA approved provider license number
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BusinessInfoSection;