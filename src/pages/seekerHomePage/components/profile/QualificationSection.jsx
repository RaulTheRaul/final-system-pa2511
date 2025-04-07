import React from "react";
const QualificationSection = ({ formData, handleChange, handleCheckboxChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Qualifications & Certifications</h3>
            <div className="space-y-4 max-w-2xl">
                <div>
                    <lable htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                        Education Level
                    </lable>
                    <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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




            </div>

        </div>
    );
}
export default QualificationSection;
