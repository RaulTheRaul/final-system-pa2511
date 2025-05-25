
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

import BusinessNavigation from "./components/BusinessNavigation";
import SeekerCard from "./components/SeekerCard";
import ViewSeekerProfileModal from "./components/ViewSeekerProfileModal";


const BusinessRecruitSeeker = () => {
    //const { userData } = useAuth();
    const [jobSeekers, setJobSeekers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        //fetch data
        const fetchSeekers = async () => {
            setLoading(true);
            try {
                //this query into the users database and will find the users based on their userType
                const seekerQuery = query(
                    collection(db, 'users'),
                    where('userType', '==', 'jobseeker')
                );

                //fetch users based on the query
                const querySnapshot = await getDocs(seekerQuery);

                //map the snapshot to an array
                const seekerList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                //Update state of seekers with fetched data
                setJobSeekers(seekerList);

                //set state of error 
                setError("");

            } catch (error) {
                //display an error message if failed to fetch seekers
                console.log('Error fetching job seekers', error);
                setError("Failed to load job seekers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        //call function
        fetchSeekers();
    }, [db]);

     //This function will open the view profile modal
        const handleViewProfileInPanel  = (seekerData) => {
            setSelectedProfile(seekerData);
        }
  

        //This function will handle the closure of the view profile modal
        const handleCloseProfileModal = () => {
            setSelectedProfile(null);
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
                    
                        <h2 className="text-2xl font-bold text-[#254159] mb-4">Available Applicants</h2>
                        {/*<div className="relative">
                            <input
                                type="text"
                                placeholder="Search and Filter"
                                className="py-1 pl-5 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-transparent"
                            />
                        </div> *}
                
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
                    />
                ) : (
                    <div className="text-gray-500 text-center mt-20">
                    <p>Select a Job Seeker to view the full profile.</p>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default BusinessRecruitSeeker;