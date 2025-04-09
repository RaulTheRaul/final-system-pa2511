
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

//
const BusinessHome = () => {
    //const { userData } = useAuth();
    const [jobSeekers, setJobSeekers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(()=>{
        //fetch data
        const fetchSeekers = async () =>{
            setLoading(true);
            try{
                //this query into the users database and will find the users based on their userType
                const seekerQuery = query (
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

            } catch (error){
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
    
    //Displays a loading message
    if (loading) {
        return <div className="text-center py-8">
                    <p className="text-gray-600">Loading Job Seekers</p>
                </div>;
    }

    if (error) {
        return <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {error}
                </div>
    }

return (
    //display basic seeker information
    <div className = "space-y-4">
        {jobSeekers.map((jobseeker) => (
            
            //create a box for each seeker using their id
            <div
                key={jobseeker.id}
                className="bg-white p-6 rounded-lg shadow-sm"
            >
                {/*display relevent information*/}
                <h3 className="text-xl font-semibold">{jobseeker?.fullName}</h3>
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
    
    );
};

export default BusinessHome;