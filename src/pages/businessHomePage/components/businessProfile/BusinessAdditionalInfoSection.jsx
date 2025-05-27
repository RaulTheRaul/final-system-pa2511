import React from "react";

const BusinessAdditionalInfoSection = ({ formData, handleChange, handleCheckboxChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#254159] mb-6 border-b border-gray-300 pb-3">Staff Benefits & Development</h3>
            <div className="space-y-6">
                <div>
                    <label htmlFor="staffBenefits" className="block text-sm font-medium text-gray-700 mb-2">
                        Staff Benefits
                    </label>
                    <input
                        id="staffBenefits"
                        name="staffBenefits"
                        type="text"
                        maxLength={300}
                        value={formData.staffBenefits}
                        onChange={handleChange}
                        placeholder="e.g., Professional development, Staff discounts, Flexible hours, Health insurance"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Separate multiple benefits with commas • {formData.staffBenefits?.length || 0}/300 characters
                    </p>
                </div>

                <div>
                    <label htmlFor="careerOpportunities" className="block text-sm font-medium text-gray-700 mb-2">
                        Career Progression Opportunities
                    </label>
                    <textarea
                        id="careerOpportunities"
                        name="careerOpportunities"
                        maxLength={500}
                        rows={5}
                        value={formData.careerOpportunities}
                        onChange={handleChange}
                        placeholder="Describe career advancement opportunities at your centre - mentorship programs, leadership development, training pathways, promotion opportunities, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors resize-vertical"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.careerOpportunities?.length || 0}/500 characters
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BusinessAdditionalInfoSection;