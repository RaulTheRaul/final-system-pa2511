import { useEffect, useState } from "react";
import { collection, query, where, getDoc, orderBy, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";

import BusinessNavigation from "../components/BusinessNavigation";

const BusinessActivity = () => { 
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    const [recentReveal, setRecentReveal] = useState([]);

    useEffect(() => {
        
        if (!currentUser) return;
        
        //query to get info on current user reveal history
        const q = query (
                    collection(db,"revealedTest"),
                    where("businessId", "==", currentUser.uid),
                    orderBy("createdAt", "desc")
                );
        
        //unsubscribe will tell firebase to stop sending updates to the database 
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const revealWithSeekers = [];  //storing combine data

            for (const docSnap of snapshot.docs) {
                const revealData = docSnap.data(); //get data
                const jobSeekerUID = revealData.seekerId; //get seeker ID
                const jobSeekerRef = doc(db, "users", jobSeekerUID);

                try {
                    const seekerSnap = await getDoc(jobSeekerRef); //get seeker document

                    //check if data exists, if it does then combine data
                    if (seekerSnap.exists()){
                        const seekerData = seekerSnap.data();
                          
                        revealWithSeekers.push({
                            id: docSnap.id,
                            createdAt: revealData.createdAt?.toDate().toLocaleString(),
                            seeker: seekerData,
                        });
                    } else {
                        console.log("Job seeker UID not found for reveal");
                    
                    } 
                } catch (err){
                        console.error("Error fetching revealed seekers", err);
                    }
            }
            setRecentReveal(revealWithSeekers);
        });
        return() => unsubscribe();
    }, [currentUser, db]);
    
    return (
        <div className="min-h-screen bg-[#f2ece4] font-sans">
        <BusinessNavigation />
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex flex-col md:flex-row gap-6">

                {/* Your Activity, Left Col:
                 - Will display the applicants that have their contact details revealed */}
                <div className="md:w-1/2 bg-[#EEEEEE] rounded-lg shadow-sm p-6">
                    <h2 className = "text-2xl font-bold text-[#254159] mb-6"> Your Activity </h2>
                    
                    <div className="space-y-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2"> Recent Applicants</h3>
                    {/* This section will load applicants */}
                    
                    <div>
                    <ul className="mt-2">
                    {recentReveal.length > 0 ? (
                        //iterate and display data if there have been reveals
                        recentReveal.map((reveal) => (
                            <li key = {reveal.id} className="mb-4 bg-[#F1EEEB] p-2 rounded shadow flex flex-col justify-between border border-gray-200">
                                <p><span className="text-[#254159] font-semibold">{reveal.seeker?.fullName || "Name Not Provided"} </span></p> 
                                <p className="text-sm text-gray-600">Qualification: {reveal.seeker?.jobseekerInformation?.educationLevel || 'Not provided'} </p> 
                                <p className="text-sm text-gray-600">Email: {reveal.seeker?.jobseekerInformation?.educationLevel || 'Not provided'}</p>
                                <p className="text-sm text-gray-600">Revealed On: {reveal.createdAt}</p>
                                
                                
                            </li>
                        ))
                    ):(
                        //display no applicants if there is none
                        <li className="py-2 text-gray-500">No applicants revealed yet.</li>
                    )}   
                    </ul>   
                    </div>     
                    </div>
                </div>
                
                {/* Jobs Posted Right Col
                 - Will display the jobs posted by the business*/}
                <div className="md:w-1/2 bg-[#EEEEEE] rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-[#254159] mb-6">Jobs Posted</h2>
                     
                    <div className="space-y-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2"> Recent Jobs Posted</h3>
                    </div>

                </div>

                </div>
            </div>
        </div>
    )
}

export default BusinessActivity;