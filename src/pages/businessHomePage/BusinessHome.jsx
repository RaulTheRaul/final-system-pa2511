
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import BusinessNavigation from "./components/BusinessNavigation";

import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

//aa
const BusinessHome = () => {
    //const { userData } = useAuth();
    const [jobSeekers, setJobSeekers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { currentUser } = useAuth();

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
                const seekerList = querySnapshot.docs.map((doc) => ({
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
    }, []);

    if (error) {
        return <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {error}
        </div>
    }

    //This function allows a business to recruit a seeker
    const handleRecruit = async () => {

    }

    return (
        //display basic seeker information
        <div className="min-h-screen bg-[#f2ece4]">
            <BusinessNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <div className=" bg-[#EEEEEE] rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between">
                    <h2 className="text-2xl font-bold text-[#254159] mb-6">Available Applicants</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search and Filter"
                                className="py-1 pl-5 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f2be5c] focus:border-transparent"
                            />
                        </div>
                    </div>

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
                            {jobSeekers.map((jobseeker) => (

                                //create a box for each seeker using their id
                                <div
                                    key={jobseeker.id}
                                    className="bg-[#F1EEEB] p-6 rounded-lg shadow-sm"
                                >
                                    {/*display relevent information*/}
                                    <h3 className="text-xl font-semibold text-[#254159]">{jobseeker?.fullName}</h3>
                                    <p className="text-gray-700">Availability: {jobseeker?.jobseekerInformation?.availability}</p>
                                    <p className="text-gray-700">Shift Preference: {jobseeker?.jobseekerInformation?.shiftPreference}</p>
                                    <p className="text-gray-700">Preferred Role: {jobseeker?.jobseekerInformation?.preferredRole} </p>
                                    <p className="text-gray-600">Bio: {jobseeker?.jobseekerInformation?.bio}</p>

                                    {/* Link to the user profile 
                    <Link
                        to="../pages/seekerHomePage/SeekerProfilePage"
                    >
                        View Profile
                    </Link>*/}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessHome;