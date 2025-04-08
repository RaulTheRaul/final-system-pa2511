import React from "react"

const PreferencesSection = ({ formData, handleChange, handleCheckboxChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">
                Preferences & Work Conditions
            </h3>

            <div className="space-y-4" >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="preferredRole" className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Role
                        </label>
                        <select
                            id="preferredRole"
                            name="preferredRole"
                            value={formData.preferredRole}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                        >
                            <option value="educator">Educator</option >
                            <option value="room-leader">Room Leader</option>
                            <option value="assistant">Educational Assistant</option>
                            <option value="director">Director</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="shiftPreference" className="block text-sm font-medium text-gray-700 mb-1">
                            Shift Preference
                        </label>
                        <select
                            id="shiftPreference"
                            name="shiftPreference"
                            value={formData.shiftPreference}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                        >
                            <option value="any">Any Shift</option>
                            <option value="morning">Morning Shift</option>
                            <option value="afternoon">Afternoon Shift</option>
                            <option value="evening">Evening Shift</option>
                            <option value="overnight">Overnight Shift</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="desiredPayRate" className="block text-sm font-medium text-gray-700 mb-1">
                            Desired Pay Rate ($/hour)
                        </label>
                        <input
                            id="desiredPayRate"
                            name="desiredPayRate"
                            type="text"
                            value={formData.desiredPayRate}
                            onChange={handleChange}
                            placeholder="e.g., $25-30/hour"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                        />
                    </div>

                    <div>
                        <label htmlFor="maxTravelDistance" className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Travel Distance (km)
                        </label>
                        <input
                            id="maxTravelDistance"
                            name="maxTravelDistance"
                            type="number"
                            min="0"
                            value={formData.maxTravelDistance}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="transportMethod" className="block text-sm font-medium text-gray-700 mb-1">
                        Transport Method
                    </label>
                    <select
                        id="transportMethod"
                        name="transportMethod"
                        value={formData.transportMethod}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    >
                        <option value="">Select Transport Method</option>
                        <option value="own-vehicle">Own Vehicle</option>
                        <option value="public-transport">Public Transport</option>
                        <option value="walking">Walking/Cycling</option>
                        <option value="varied">Varied/Multiple Methods</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="workplaceValues" className="block text-sm font-medium text-gray-700 mb-1">
                        Important Workplace Values
                    </label>
                    <textarea
                        id="workplaceValues"
                        name="workplaceValues"
                        rows="3"
                        value={formData.workplaceValues}
                        onChange={handleChange}
                        placeholder="E.g., Supportive team environment, Professional development opportunities, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    ></textarea>
                </div>

                <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                        <input
                            id="immediateStart"
                            name="immediateStart"
                            type="checkbox"
                            checked={formData.immediateStart}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-blue-600 focus:ring-[#f2be5c] border-gray-300 rounded"
                        />
                        <label htmlFor="immediateStart" className="ml-2 block text-sm text-gray-700">
                            Available for immediate start
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="workTrialAvailability"
                            name="workTrialAvailability"
                            type="checkbox"
                            checked={formData.workTrialAvailability}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-blue-600 focus:ring-[#f2be5c] border-gray-300 rounded"
                        />
                        <label htmlFor="workTrialAvailability" className="ml-2 block text-sm text-gray-700">
                            Available for work trials
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default PreferencesSection;