import React from "react"

const AdditionalInfoSection = ({ formData, handleChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Addtional Information</h3>

            <div className="space-y-4 max-w-2xl">
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        maxLength={500}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
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
                            placeholder="Music, Arts, Foreign Languages"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"

                        />

                    </div>
                </div>

            </div>

        </div>
    );

};

export default AdditionalInfoSection;