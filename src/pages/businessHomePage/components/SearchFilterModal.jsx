import { useEffect, useState } from "react";
import { 
    AVAILABILITY_OPTIONS,                       //part time, casual
    EDUCATION_LEVEL_OPTIONS,                     //diploma, bachelor
    LOCATION_OPTIONS,
    PREFERRED_ROLE_OPTIONS,                      //educator, room leader
    SHIFT_PREFERENCE_OPTIONS                       //morning, afternoon
 } from "../../../utils/BusinessFilterConstants";


const SearchFilterModal = ({isOpen, onClose, onApplyFilters, initialFilters}) => {
    //variables with use state containing default value 
    const [selectedAvailability, setSelectedAvailability] = useState(initialFilters.availability || "N/A");
    const [selectedEducation, setSelectedEducation] = useState(initialFilters.educationLevel || "N/A");
    const [selectedLocation, setSelectedLocation] = useState(initialFilters.location || "N/A");
    const [selectedRole, setSelectedRole] = useState(initialFilters.preferredRole || "N/A");
    const [selectedShift, setSelectedShift] = useState(initialFilters.shiftPreference || "N/A");
    
    //sets the initial values and ensures dropdown shows correct active filters
    useEffect(() => {
        setSelectedAvailability(initialFilters.availability || "N/A");
        setSelectedEducation(initialFilters.educationLevel || "N/A");
        setSelectedLocation(initialFilters.location || "N/A");
        setSelectedRole(initialFilters.preferredRole || "N/A");
        setSelectedShift(initialFilters.shiftPreference || "N/A");
    }, [initialFilters]);

    if(!isOpen){
        return null;
    }

    //This function will handle the selected filters. 
    const handleApply = () => {
        const filters = {
            availability: selectedAvailability === "N/A" ? null : selectedAvailability,
            educationLevel: selectedEducation === "N/A" ? null : selectedEducation,
            location: selectedLocation === "N/A" ? null : selectedLocation,
            preferredRole: selectedRole === "N/A" ? null : selectedRole,
            shiftPreference: selectedShift === "N/A" ? null : selectedShift,
        };
        onApplyFilters(filters) //call apply filters with new filtered list
        onClose();              //close after applying filter
    };

    //This function will clear the filters, resetting dropboxes/selections
    const handleClearSelection = () => {
        setSelectedAvailability("N/A");
        setSelectedEducation("N/A");
        setSelectedLocation("N/A");
        setSelectedRole("N/A");
        setSelectedShift("N/A");
        onApplyFilters({ 
            availability: null,
            educationLevel: null,
            location: null,
            preferredRole: null,
            shiftPreference: null,
        });
        onClose();
    }

    if (!isOpen) return null;

return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[1px]">
        
        <div
        className="absolute inset-0"
         onClick={onClose} // Click outside the box to close
         >  
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border-2 border-gray-400 relative">
            
            
            <h3 className="text-xl font-bold text-[#26425A] mb-4"> Filter Applicants</h3>

            {/* Filter dropdowns */}
            <div className="space-y-4">
                {/* Education Filter */}
            <div>
                <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Education Level:
                </label>
                <select
                    id="educationLevel"
                    value={selectedEducation}
                    onChange={(e) => setSelectedEducation(e.target.value)} //when user selects, retrieve new value
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-400 focus:outline-none focus:ring-[#26425A] focus:border-[#26425A] sm:text-sm rounded-md"
                    >
                    {/* Create drop down items */}
                    {EDUCATION_LEVEL_OPTIONS.map((option) => (
                        <option
                            key={option.value} 
                            value={option.value} 
                        >
                            {option.label}

                        </option>
                    ))}
                </select>
            </div>

            {/* Location Filter */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location:
                </label>
                <select
                    id="location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)} //when user selects, retrieve new value
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-400 focus:outline-none focus:ring-[#26425A] focus:border-[#26425A] sm:text-sm rounded-md"
                    >
                    {/* Create drop down items */}
                    {LOCATION_OPTIONS.map((option) => (
                        <option
                            key={option.value} 
                            value={option.value} 
                        >
                            {option.label}

                        </option>
                    ))}
                </select>
            </div>

            {/* Availability Filter */}
            <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                    Availability:
                </label>
                <select
                    id="availability"
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)} //when user selects, retrieve new value
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-400 focus:outline-none focus:ring-[#26425A] focus:border-[#26425A] sm:text-sm rounded-md"
                    >
                    {/* Create drop down items */}
                    {AVAILABILITY_OPTIONS.map((option) => (
                        <option
                            key={option.value} 
                            value={option.value} 
                        >
                            {option.label}

                        </option>
                    ))}
                </select>
            </div>

            {/* Preferred Role Filter */}
            <div>
                <label htmlFor="preferredRole" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Role:
                </label>
                <select
                    id="preferredRole"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)} //when user selects, retrieve new value
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-400 focus:outline-none focus:ring-[#26425A] focus:border-[#26425A] sm:text-sm rounded-md"
                    >
                    {/* Create drop down items */}
                    {PREFERRED_ROLE_OPTIONS.map((option) => (
                        <option
                            key={option.value} 
                            value={option.value} 
                        >
                            {option.label}

                        </option>
                    ))}
                </select>
            </div>

            {/* Shift Preference Filter */}
            <div>
                <label htmlFor="shiftPreference" className="block text-sm font-medium text-gray-700 mb-1">
                    Shift Preference:
                </label>
                <select
                    id="shiftPreference"
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)} //when user selects, retrieve new value
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-400 focus:outline-none focus:ring-[#26425A] focus:border-[#26425A] sm:text-sm rounded-md"
                    >
                    {/* Create drop down items */}
                    {SHIFT_PREFERENCE_OPTIONS.map((option) => (
                        <option
                            key={option.value} 
                            value={option.value} 
                        >
                            {option.label}

                        </option>
                    ))}
                </select>
            </div>

            </div> {/* End of drop down*/} 

            {/* Clear and Apply filter buttons*/}
            <div className="mt-6 flex justify-end space-x-3">
                <button
                    onClick={handleClearSelection}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-"
                >
                    Clear Filters
                </button>

                <button
                    onClick={handleApply}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border border-transparent bg-[#26425A] text-white hover:bg-[#F2BE5C]"
                >
                    Apply Filters
                </button>
            </div>
            

        </div>
    </div>
)};

export default SearchFilterModal;
