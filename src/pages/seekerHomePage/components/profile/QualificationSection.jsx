import React from "react";
const QualificationSection = ({ formData, handleChange, handleCheckboxChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Qualifications & Certifications</h3>
            <div className="space-y-4 max-w-2xl">
                <div>
                    <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                        Education Level
                    </label>
                    <select
                        id="educationLevel"
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    >
                        <option value="">Select Education Level</option>
                        <option value="Cert III">Certificate  III in Early Childhood Education</option>
                        <option value="Diploma">Diploma of Early Childhood Education</option>
                        <option value="Bachelor">Bachelor of Early Childhood Education</option>
                        <option value="Masters">Masters or Higher</option>
                        {/* Might have to implement a section for specificing others. */}
                        <option value="Other">Other Qualification</option>

                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="educationInstitution" className="block text-sm font-medium text-gray-700 mb-1">
                            Education Institution
                        </label>
                        <input
                            id="educationInstitution"
                            name="educationInstitution"
                            type="text"
                            value={formData.educationInstitution}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                        />
                    </div>

                    <div>
                        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Graduation Year
                        </label>
                        <input
                            id="graduationYear"
                            name="graduationYear"
                            type="number"
                            min="1950"
                            max="2030"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="additionalCourses" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Courses or Qualifications
                    </label>
                    <input
                        id="additionalCourses"
                        name="additionalCourses"
                        type="text"
                        value={formData.additionalCourses}
                        onChange={handleChange}
                        placeholder="E.g., Leadership course, Child behavior management"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple courses with commas</p>
                </div>

                <h4 className="font-medium text-gray-700 mt-4">Certifications</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <input
                                id="firstAid"
                                name="firstAid"
                                type="checkbox"
                                checked={formData.firstAid}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-blue-600 focus:ring-[#f2be5c] border-gray-300 rounded"
                            />
                            <label htmlFor="firstAid" className="ml-2 block text-sm font-medium text-gray-700">
                                First Aid Certificate
                            </label>
                        </div>

                        {formData.firstAid && (
                            <div>
                                <label htmlFor="firstAidExpiry" className="block text-xs text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    id="firstAidExpiry"
                                    name="firstAidExpiry"
                                    type="date"
                                    value={formData.firstAidExpiry}
                                    onChange={handleChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                />
                            </div>
                        )}
                    </div>

                    <div className="border p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <input
                                id="childProtection"
                                name="childProtection"
                                type="checkbox"
                                checked={formData.childProtection}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-blue-600 focus:ring-[#f2be5c] border-gray-300 rounded"
                            />
                            <label htmlFor="childProtection" className="ml-2 block text-sm font-medium text-gray-700">
                                Child Protection Certificate
                            </label>
                        </div>

                        {formData.childProtection && (
                            <div>
                                <label htmlFor="childProtectionExpiry" className="block text-xs text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    id="childProtectionExpiry"
                                    name="childProtectionExpiry"
                                    type="date"
                                    value={formData.childProtectionExpiry}
                                    onChange={handleChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                />
                            </div>
                        )}
                    </div>

                    <div className="border p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <input
                                id="anaphylaxis"
                                name="anaphylaxis"
                                type="checkbox"
                                checked={formData.anaphylaxis}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-blue-600 focus:ring-[#f2be5c] border-gray-300 rounded"
                            />
                            <label htmlFor="anaphylaxis" className="ml-2 block text-sm font-medium text-gray-700">
                                Anaphylaxis Management
                            </label>
                        </div>

                        {formData.anaphylaxis && (
                            <div>
                                <label htmlFor="anaphylaxisExpiry" className="block text-xs text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    id="anaphylaxisExpiry"
                                    name="anaphylaxisExpiry"
                                    type="date"
                                    value={formData.anaphylaxisExpiry}
                                    onChange={handleChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                />
                            </div>
                        )}
                    </div>

                    <div className="border p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <input
                                id="asthma"
                                name="asthma"
                                type="checkbox"
                                checked={formData.asthma}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-blue-600 focus:ring-[#f2be5c] border-gray-300 rounded"
                            />
                            <label htmlFor="asthma" className="ml-2 block text-sm font-medium text-gray-700">
                                Asthma Management
                            </label>
                        </div>

                        {formData.asthma && (
                            <div>
                                <label htmlFor="asthmaExpiry" className="block text-xs text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    id="asthmaExpiry"
                                    name="asthmaExpiry"
                                    type="date"
                                    value={formData.asthmaExpiry}
                                    onChange={handleChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                />
                            </div>
                        )}
                    </div>
                    <div className="border p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <input
                                id="wwcc"
                                name="wwcc"
                                type="checkbox"
                                checked={formData.wwcc}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-blue-600 focus:ring-[#f2be5c] border-gray-300 rounded"
                            />
                            <label htmlFor="wwcc" className="ml-2 block text-sm font-medium text-gray-700">
                                Working with Children Check
                            </label>
                        </div>

                        {formData.wwcc && (
                            <div>
                                <label htmlFor="wwccExpiry" className="block text-xs text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    id="wwccExpiry"
                                    name="wwccExpiry"
                                    type="date"
                                    value={formData.wwccExpiry}
                                    onChange={handleChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                />
                            </div>
                        )}
                    </div>
                </div>




            </div>

        </div>
    );
}
export default QualificationSection;
