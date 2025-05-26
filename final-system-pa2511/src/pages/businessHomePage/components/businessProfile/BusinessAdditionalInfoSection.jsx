import React from "react";

const BusinessAdditionalInfoSection=({formData, handleChange, handleCheckboxChange}) => {
    return(
        <div>
            <h3 className="text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Staff Benefits</h3>
            <div className="space-y-4 max-w-2xl">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple benefits with commas</p>
                </div>

                <div>
                    <label htmlFor="careerOpportunities" className="block text-sm font-medium text-gray-700 mb-1">
                        Career Progression Opportunities
                    </label>
                    <textarea
                        id="careerOpportunities"
                        name="careerOpportunities"
                        maxLength={500}
                        value={formData.careerOpportunities}
                        onChange={handleChange}
                        placeholder="Describe career advancement opportunities at your centre"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    ></textarea>
                </div>

            </div>
        </div>
    )

}

export default BusinessAdditionalInfoSection;