import React from "react";

const BusinessInfoSection=({formData, handleChange, handleCheckboxChange}) => {
    return(
        <div>
            <h3 className="text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Business Information</h3>
            <div className="space-y-4 max-w-2xl">
                <div> {/*Input to change business name*/}
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name
                    </label>
                    <input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Please provide business name."
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>
                <div> {/*Input to change business aceqca*/}
                <label htmlFor="acecqaRating" className="block text-sm font-medium text-[#0d1826] mb-1">
                        ACECQA Rating
                    </label>
                    <select
                        id="acecqaRating"
                        name="acecqaRating"
                        value={formData.acecqaRating}
                        onChange={handleChange}
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
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
    )

}

export default BusinessInfoSection;