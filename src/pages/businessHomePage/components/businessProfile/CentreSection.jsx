import React from "react";

const BusinessCentreSection = ({ formData, handleChange, handleCheckboxChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Centre Information</h3>
            <div className="space-y-4 max-w-2xl">
                <div> {/*Input to change business name*/}
                    <label htmlFor="centreName" className="block text-sm font-medium text-gray-700 mb-1">
                        Centre Name
                    </label>
                    <input
                        id="centreName"
                        name="centreName"
                        value={formData.centreName}
                        onChange={handleChange}
                        placeholder="Please provide business name."
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>{/*Input to get location*/}
                    <label htmlFor="centreAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        id="centreAddress"
                        name="centreAddress"
                        value={formData.centreAddress}
                        onChange={handleChange}
                        placeholder="Please provide the centre address"
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>{/*Input to get Phone*/}
                    <label htmlFor="centrePhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        id="centrePhone"
                        name="centrePhone"
                        value={formData.centrePhone}
                        onChange={handleChange}
                        placeholder="Please provide the centre phone"
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>{/*Input to get Operating Hours*/}
                    <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-700 mb-1">
                        Operating Hours
                    </label>
                    <input
                        id="operatingHours"
                        name="operatingHours"
                        value={formData.operatingHours}
                        onChange={handleChange}
                        placeholder="e.g, 9:00am-5:00pm"
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>{/*Input to get Centre type*/}
                    <label htmlFor="centreType" className="block text-sm font-medium text-gray-700 mb-1">
                        Centre Type
                    </label>
                    <select
                        id="centreType"
                        name="centreType"
                        value={formData.centreType}
                        onChange={handleChange}
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    >
                        <option value="childcare">Childcare Center</option>
                        <option value="long-day-care">Long Day Care</option>
                        <option value="family-day-care">Family Day Care</option>
                        <option value="outside-school-hours">Outside School Hours Care</option>
                        <option value="preschool">Preschool/Kindergarten</option>
                        <option value="other">Other</option>
                    </select>

                </div>

                <div>{/*Input to get Teching Approach*/}
                    <label htmlFor="teachingApproach" className="block text-sm font-medium text-gray-700 mb-1">
                        Teaching Approach
                    </label>
                    <select
                        id="teachingApproach"
                        name="teachingApproach"
                        value={formData.teachingApproach}
                        onChange={handleChange}
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    >
                        <option value="play-based">Play-Based Learning</option>
                        <option value="reggio-emilia">Reggio Emilia</option>
                        <option value="montessori">Montessori</option>
                        <option value="steiner">Steiner/Waldorf</option>
                        <option value="eylf">Early Years Learning Framework</option>
                        <option value="multiple">Multiple Approaches</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>{/*Input to get Room Count*/}
                    <label htmlFor="roomCount" className="block text-sm font-medium text-gray-700 mb-1">
                        Room Count
                    </label>
                    <input
                        id="roomCount"
                        name="roomCount"
                        type="number"
                        value={formData.roomCount}
                        onChange={handleChange}
                        placeholder="Please provide the room count"
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>{/*Input to get Capacity*/}
                    <label htmlFor="centreCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Centre Capacity
                    </label>
                    <input
                        id="centreCapacity"
                        name="centreCapacity"
                        type="number"
                        min="0"
                        value={formData.centreCapacity}
                        onChange={handleChange}
                        placeholder="Please provide the centre capacity"
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>{/*Input to get staff to child ratio*/}
                    <label htmlFor="staffToChildRatio" className="block text-sm font-medium text-gray-700 mb-1">
                        Staff to Child Ratio
                    </label>
                    <input
                        id="staffToChildRatio"
                        name="staffToChildRatio"
                        type="text"
                        value={formData.staffToChildRatio}
                        onChange={handleChange}
                        placeholder="e.g., 1:4 for infants, 1:5 for toddlers"
                        className="max-w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    />
                </div>

                <div>
                    <label htmlFor="centreDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Centre Description
                    </label>
                    <textarea
                        id="centreDescription"
                        name="centreDescription"
                        maxLength={500}
                        value={formData.centreDescription}
                        onChange={handleChange}
                        placeholder="Describe career advancement opportunities at your centre"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                    ></textarea>
                </div>

            </div>
        </div>
    )

}

export default BusinessCentreSection;