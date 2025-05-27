
import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query, where, setDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

import BusinessNavigation from "./components/BusinessNavigation";
import SeekerCard from "./components/SeekerCard";
import ViewSeekerProfileModal from "./components/ViewSeekerProfileModal";
import SearchFilterModal from "./components/SearchFilterModal";


const BusinessRecruitSeeker = () => {
    const { currentUser } = useAuth();
    const [jobSeekers, setJobSeekers] = useState([]);                           //store job seekers
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProfile, setSelectedProfile] = useState(null);               //store profile data
    const [revealedSeekerIds, setRevealedSeekerIds] =useState(new Set());         // to store id of already revealed seekers
    const [isFilterOpen, setIsFilterOpen] = useState(false);                    //manage filter modal
    const [currentFilters, setCurrentFilters] = useState({                        //set default filter options
        educationLevel: null,
        location: null,
        availability: null,
        preferredRole: null,
        shiftPreference: null, 
    });

    //normalise data for consistent data fetching and ensures data has default values
    const normalizeSeekerData = (rawSeekerData, docId) => {
        const jobseekerInfo = rawSeekerData.jobseekerInformation || {};
        const certifications = jobseekerInfo.certifications || {};

        return {
            ...rawSeekerData,
            id: docId,
            fullName: rawSeekerData.fullName || "Name Not Provided",
            email: rawSeekerData.email || 'N/A',
            location: rawSeekerData.location || 'N/A', 

            jobseekerInformation: { 
                educationLevel: jobseekerInfo.educationLevel || 'N/A',
                availability: jobseekerInfo.availability || 'N/A',
                shiftPreference: jobseekerInfo.shiftPreference || 'N/A',
                bio: jobseekerInfo.bio || 'N/A',
                preferredRole: jobseekerInfo.preferredRole || 'N/A',
                willingToRelocate: jobseekerInfo.willingToRelocate ?? 'N/A', 
                educationInstitution: jobseekerInfo.educationInstitution || 'N/A',
                graduationYear: jobseekerInfo.graduationYear || 'N/A',
                resumeUrl: jobseekerInfo.resumeUrl || null, // Ensure resumeUrl is explicitly set
                desiredPayRate: jobseekerInfo.desiredPayRate || 'N/A', 

                certifications: { 
                    anaphylaxis: certifications.anaphylaxis ?? false,
                    anaphylaxisExpiry: certifications.anaphylaxisExpiry || 'N/A',
                    asthma: certifications.asthma ?? false,
                    asthmaExpiry: certifications.asthmaExpiry || 'N/A',
                    childProtection: certifications.childProtection ?? false,
                    childProtectionExpiry: certifications.childProtectionExpiry || 'N/A',
                    firstAid: certifications.firstAid ?? false,
                    firstAidExpiry: certifications.firstAidExpiry || 'N/A',
                },
                ...jobseekerInfo
            }
        }
    }

    //fetch job seeker data
    useEffect(() => {
        //fetch data
        const fetchRevealedSeekers = async () => {
            setLoading(true);
            try {

                const revealedCollection = collection(db, "revealedTest");
                const q = query(revealedCollection, where("businessId", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);

                //extract job seeker id from each document
                const ids = new Set(querySnapshot.docs.map(doc => doc.data().jobseekerId));
                setRevealedSeekerIds(ids); 
            } catch (error) {
                //display an error message if failed to fetch seekers
                console.log('Error fetching job seekers', error);
                setError("Failed to load job seekers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        //call function
        fetchRevealedSeekers();
    }, [db, currentUser]);

    //fetch jobseekers data based on current filters
    //Callback to memorise the fetch seeker function and re-create if dependencies change to prevent loops.
    const fetchSeekers = useCallback(async() =>{
        console.log("BusinessRecruitSeeker: Starting fetchSeekers with filters:", currentFilters);
        setLoading(true);
        setError("");

        try {
            //get base query
            let seekerQuery = query(
                collection(db, "users"),
                where("userType", "==", "jobseeker")
            );

            //apply the filter if not filter value is not null
            // Education Level
            if (currentFilters.educationLevel){
                seekerQuery = query(seekerQuery, where("jobseekerInformation.educationLevel", "==", currentFilters.educationLevel));
                console.log("Applying educationLevel filter:", currentFilters.educationLevel);
            }
            // Location 
            if (currentFilters.location){
                seekerQuery = query(seekerQuery, where("location", "==", currentFilters.location));
                console.log("Applying location filter:", currentFilters.location);
            }
            // Availability
            if (currentFilters.availability){
                seekerQuery = query(seekerQuery, where("jobseekerInformation.availability", "==", currentFilters.availability));
                console.log("Applying availability filter:", currentFilters.availability);
            }
            // Preferred Role
            if (currentFilters.preferredRole){
                seekerQuery = query(seekerQuery, where("jobseekerInformation.preferredRole", "==", currentFilters.preferredRole));
                console.log("Applying preferredRole filter:", currentFilters.preferredRole);
            }
            // Shift Preference
            if (currentFilters.shiftPreference){
                seekerQuery = query(seekerQuery, where("jobseekerInformation.shiftPreference", "==", currentFilters.shiftPreference));
                console.log("Applying shiftPreference filter:", currentFilters.shiftPreference);
            }

            const querySnapshot = await getDocs(seekerQuery);
            console.log("BusinessRecruitSeeker: Job Seeker QuerySnapshot received:", querySnapshot.docs.length, "documents.");
        
            //map query
            const seekerList = querySnapshot.docs.map(doc =>{
                const rawData = doc.data();
                const normalizedSeeker = normalizeSeekerData(rawData, doc.id);
                return normalizedSeeker;
            });

            setJobSeekers(seekerList); //Update state of seekers with new fetched data
            setError("");   //clear error states
        } catch (err) {
            console.error('BusinessRecruitSeeker: Error fetching job seekers:', error);
            setError("Failed to load job seekers. Please try again later.");
        } finally {
            setLoading(false);
        }

    }, [db, currentFilters]);

    //check if there is a database and call fetchSeekers
    useEffect(() => {
        if ( db ){
            fetchSeekers();
        } else {
            console.log("BusinessRecruitSeeker: db not available");
        }
    }, [db, fetchSeekers]);


    //This function will track if the business have already revealed the profile.
    // SeekerId - the id of the selected revealed seeker
    const handleRevealProfile = async (seekerId) => {
        if (!currentUser || !currentUser.uid){
            return;
        }
    };
    
    //Profile Modal Handles
        //This function will open the view profile modal
        const handleViewProfileInPanel  = (seekerData) => {
            setSelectedProfile(seekerData);
            handleRevealProfile(seekerData.id);
        }
  
        //This function will handle the closure of the view profile modal
        const handleCloseProfileModal = () => {
            setSelectedProfile(null);
        }
    
    //Filter Modal Handles
        const handleOpenFilter = () => {
            setIsFilterOpen(true);
        }

        const handleCloseFilter = () => {
            setIsFilterOpen(false);
        }

        const handleApplyFilters = (filters) => {
            console.log("Applying filters:", filters);
            setCurrentFilters(filters);
        }

    if (error) {
        return <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {error}
        </div>
    }

    return (
        //display basic seeker information
        <div className="min-h-screen bg-[#f2ece4]">
            <BusinessNavigation />

            {/* left panel */}
            <div className="flex max-h-[calc(100vh-64px)]">
                <div className=" w-1/2 border-r overflow-y-auto p-6">
                    
                        <div className="flex justify-between items-center mb-4"> {/*  */}
                        <h2 className="text-2xl font-bold text-[#254159] mb-4">Available Applicants</h2>
                            <button
                                onClick={handleOpenFilter}
                                className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border border-transparent bg-[#f2be5c] text-white hover:bg-[#e0a44d]"
                            >
                                Filter Applicants
                            </button>
                        </div>
                        
                    {/* Display active filters // WIP*/}


                    {/* Display if no applicants */}
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading list of applicants...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md">
                            {error}
                        </div>
                    ) : jobSeekers.length === 0 ? (
                        <div className="text-center py-8 bg-[#F1EEEB] rounded-lg">
                            <p className="text-gray-600">No applicants available at this time.</p>
                            <p className="text-gray-500 text-sm mt-2">Check back later for new applicants.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {jobSeekers.map((seekerInfo) => (
                                <SeekerCard
                                    key={seekerInfo.id}
                                    seekerInfo={seekerInfo}
                                    isNameRevealed={revealedSeekerIds.has(seekerInfo.id)}
                                    onViewProfile={handleViewProfileInPanel}
                                    currentlySelectedProfile={selectedProfile}
                                    onClosePanel={handleCloseProfileModal}
                                />
                            ))}
                        </div>

                    )}
                </div>

                {/* Right Panel*/}
                <div className="w-1/2 overflow-y-auto p-6">
                {selectedProfile ? (
                    <ViewSeekerProfileModal 
                    seekerData={selectedProfile} 
                    onClose={handleCloseProfileModal} 
                    isOpen={!!selectedProfile}
                    />
                ) : (
                    <div className="text-gray-500 text-center mt-20">
                    <p>Select a Job Seeker to view the full profile.</p>
                    </div>
                )}
                    </div>
            </div>
            
            {/* Render Filter Modal*/}
            <SearchFilterModal 
                isOpen={isFilterOpen}
                onClose={handleCloseFilter}
                onApplyFilters={handleApplyFilters}
                initialFilters={currentFilters} //prefill
            />

        </div>
    );
};

export default BusinessRecruitSeeker;