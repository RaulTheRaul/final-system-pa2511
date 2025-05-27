import React from "react";

const BusinessCentreSection = ({ formData, handleChange, handleCheckboxChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#254159] mb-6 border-b border-gray-300 pb-3">Centre Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"> {/*Input to change centre name*/}
                    <label htmlFor="centreName" className="block text-sm font-medium text-gray-700 mb-2">
                        Centre Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="centreName"
                        name="centreName"
                        maxLength={100}
                        value={formData.centreName}
                        onChange={handleChange}
                        placeholder="Please provide centre name."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.centreName?.length || 0}/100 characters
                    </p>
                </div>

                <div className="md:col-span-2">{/*Input to get location*/}
                    <label htmlFor="centreAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Centre Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="centreAddress"
                        name="centreAddress"
                        maxLength={200}
                        value={formData.centreAddress}
                        onChange={handleChange}
                        placeholder="Please provide the centre address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.centreAddress?.length || 0}/200 characters
                    </p>
                </div>

                <div>{/*Input to get Phone*/}
                    <label htmlFor="centrePhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input
                        id="centrePhone"
                        name="centrePhone"
                        type="tel"
                        maxLength={15}
                        value={formData.centrePhone}
                        onChange={handleChange}
                        placeholder="Please provide the centre phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.centrePhone?.length || 0}/15 characters
                    </p>
                </div>

                <div>{/*Input to get website URL*/}
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                    </label>
                    <input
                        id="websiteUrl"
                        name="websiteUrl"
                        type="url"
                        maxLength={100}
                        value={formData.websiteUrl}
                        onChange={handleChange}
                        placeholder="https://www.yourcentre.com.au"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.websiteUrl?.length || 0}/100 characters
                    </p>
                </div>

                <div>{/*Input to get Operating Hours*/}
                    <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-700 mb-2">
                        Operating Hours
                    </label>
                    <input
                        id="operatingHours"
                        name="operatingHours"
                        maxLength={50}
                        value={formData.operatingHours}
                        onChange={handleChange}
                        placeholder="e.g, 6:30am-6:30pm Monday to Friday"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.operatingHours?.length || 0}/50 characters
                    </p>
                </div>

                <div>{/*Input to get Centre type*/}
                    <label htmlFor="centreType" className="block text-sm font-medium text-gray-700 mb-2">
                        Centre Type
                    </label>
                    <select
                        id="centreType"
                        name="centreType"
                        value={formData.centreType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors bg-white"
                    >
                        <option value="">Select centre type</option>
                        <option value="ldc">LDC (Long Day Care)</option>
                        <option value="ooshc">OOSHC (Outside of School Hours Care)</option>
                        <option value="preschool">Preschool/Kindergarten</option>
                        <option value="mixed">Mixed</option>
                    </select>
                </div>

                <div>{/*Input to get Capacity*/}
                    <label htmlFor="centreCapacity" className="block text-sm font-medium text-gray-700 mb-2">
                        Centre Capacity
                    </label>
                    <input
                        id="centreCapacity"
                        name="centreCapacity"
                        type="number"
                        min="1"
                        max="500"
                        value={formData.centreCapacity}
                        onChange={handleChange}
                        placeholder="Please provide the centre capacity"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Maximum 500 children
                    </p>
                </div>

                <div>{/*Input to get staff to child ratio*/}
                    <label htmlFor="staffToChildRatio" className="block text-sm font-medium text-gray-700 mb-2">
                        Staff to Child Ratios Provided
                    </label>
                    <select
                        id="staffToChildRatio"
                        name="staffToChildRatio"
                        value={formData.staffToChildRatio}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors bg-white"
                    >
                        <option value="">Select ratio standard</option>
                        <option value="meeting-regulated">Meeting Regulated Ratios</option>
                        <option value="above-regulated">Above Regulated Ratios</option>
                        <option value="enhanced">Enhanced Ratios (Better than required)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Australian childcare regulations require specific staff-to-child ratios by age group
                    </p>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="centreDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Centre Description
                    </label>
                    <textarea
                        id="centreDescription"
                        name="centreDescription"
                        maxLength={500}
                        rows={5}
                        value={formData.centreDescription}
                        onChange={handleChange}
                        placeholder="Describe your centre's philosophy, programs, and what makes it special..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-[#f2be5c] transition-colors resize-vertical"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.centreDescription?.length || 0}/500 characters
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BusinessCentreSection;