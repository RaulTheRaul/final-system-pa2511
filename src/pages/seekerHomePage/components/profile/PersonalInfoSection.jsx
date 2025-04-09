import React from "react";

const PersonalInfoSection = ({ formData, handleChange, handleCheckboxChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Personal Information</h3>
            <div className="space-y-4 max-w-2xl">
                <div>{/*Input to change Full name*/}
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Please provide full name."
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>{/*Input to get Preferred name*/}
                    <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Name
                    </label>
                    <input
                        id="preferredName"
                        name="preferredName"
                        value={formData.preferredName}
                        onChange={handleChange}
                        placeholder="optional preferred name"
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>{/*Input for inputing location*/}
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="city, State"
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div className="flex items-center"> {/*Checkbox to select willingToReclocate (either true/false)*/}
                    <label htmlFor="willingToRelocate" className="mr-2 block text-sm text-gray-700">
                        Willing To Relocate?
                    </label>
                    <input
                        id="willingToRelocate"
                        name="willingToRelocate"
                        type="checkbox"
                        checked={formData.willingToRelocate}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-[#f2be5c] border-gray-300 rounded"
                    />
                    
                </div>

                <div> {/*drop down for selecting availability*/}
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                    </label>
                    <select
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="casual">Casual</option>
                        <option value="flexible">Flexible</option>                        
                    </select>    
                
                </div>    
                

            </div>
        </div>
    );
}
export default PersonalInfoSection;
