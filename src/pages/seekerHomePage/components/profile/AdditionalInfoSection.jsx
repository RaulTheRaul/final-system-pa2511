import React from "react"

const AdditionalInfoSection = ({ formData, handleChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Addtional Information</h3>

            <div className="space-y-4 max-w-2xl">
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                    </label>
                    <textarea
                        id = "bio"
                        name = "bio"
                        maxLength={500}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                    </label>
                    <input
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Skills
                    </label>
                    <input
                        id="specialSkills"
                        name="specialSkills"
                        type="text"
                        value={formData.specialSkills}
                        onChange={handleChange}
                        placeholder="E.g., Music, Arts, Foreign Languages, Special Needs Experience"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    
                    />

                </div>

            </div>

        </div>
    );

};

export default AdditionalInfoSection;