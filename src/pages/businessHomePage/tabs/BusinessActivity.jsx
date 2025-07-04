import { useEffect, useState } from "react";
import { collection, query, where, getDoc, orderBy, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";
import BusinessNavigation from "../components/BusinessNavigation";
import ViewSeekerProfileModal from "../components/ViewSeekerProfileModal";

const BusinessActivity = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentReveal, setRecentReveal] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch revealed seekers
  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    let unsubscribe = null;

    try {
      //query into the database and sort by reveal time
      const q = query(
        collection(db, "revealedTest"),
        where("businessId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const revealWithSeekers = [];                                           //Empy array to store all reveal data

          //Iterate through each document and store relevant data
          for (const docSnap of snapshot.docs) {                                  
            const revealData = docSnap.data();                                    //Get content from revealed data
            const jobSeekerUID = revealData.seekerId;                             //Get seekerId from reveal data

            //skips any documents that do not have seekerId
            if (!jobSeekerUID) {
              console.warn("Missing seekerId in reveal data");
              continue;
            }
            
            const jobSeekerRef = doc(db, "users", jobSeekerUID);                   //create reference of users using jobseekerUID data          
            try {
              //fetch seeker profile
              const seekerSnap = await getDoc(jobSeekerRef);

              //check if seeker profile exists
              if (seekerSnap.exists()) {
                const seekerData = seekerSnap.data();                             //Get data of that seeker
                revealWithSeekers.push({                                          //put all their data into an array
                  id: docSnap.id,
                  createdAt: revealData.createdAt?.toDate().toLocaleString(),
                  seeker: seekerData,
                });
              } else {
                console.log("Job seeker UID not found for reveal:", jobSeekerUID);
              }
            } catch (err) {
              console.error("Error fetching revealed seeker:", err);
            }
          }

          //update recent reveals with new data
          setRecentReveal(revealWithSeekers);
        },
        (error) => {
          console.error("Error in revealed seekers listener:", error);
        }
      );
    } catch (error) {
      console.error("Error setting up revealed seekers listener:", error);
    }
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser?.uid]);

  // ✅ Fetch posted jobs
  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    let unsubscribe = null;

    try {
      const q = query(
        collection(db, "jobs"),
        where("businessId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const jobList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setJobs(jobList);
          setLoading(false);
        },
        (error) => {
          console.error("Error in jobs listener:", error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error setting up jobs listener:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser?.uid]);

  //this sets or clears the selected seeker state if the user clicks on view profile
  const handleViewProfile = (revealEvent) => {
    if (selectedSeeker && selectedSeeker.id === revealEvent.id) {
      setSelectedSeeker(null);
    } else {
      setSelectedSeeker(revealEvent);
    }
  };

  //handles the close function when closing the profile
  const handleCloseViewProfile = () => {
    setSelectedSeeker(null);
  };

  const handleDeleteJob = async (jobId) => {
    try {
      if (window.confirm("Are you sure you want to delete this job?")) {
        await deleteDoc(doc(db, "jobs", jobId));
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Error deleting job. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2ece4] font-sans">
      <BusinessNavigation />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Recent Applicants */}
          <div className="md:w-1/2 bg-[#F8F8F8] rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-[#254159] mb-6">Your Activity</h2>
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Revealed Profiles</h3>
              <ul className="mt-2">
                {recentReveal.length > 0 ? (
                  recentReveal.map((reveal) => (
                    <li
                      key={reveal.id}
                      className={`mb-4 bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-100 transition-colors duration-200
                        ${selectedSeeker && selectedSeeker.id === reveal.id ? 'border-2 border-[#f2be5c]' : ''}`}
                      onClick={() => handleViewProfile(reveal)}
                    >
                      <p><span className="text-[#254159] font-semibold">{reveal.seeker?.fullName || "Name Not Provided"}</span></p>
                      <p className="text-sm text-gray-600">Qualification: {reveal.seeker?.jobseekerInformation?.educationLevel || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Email: {reveal.seeker?.email || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Revealed On: {reveal.createdAt}</p>
                    </li>
                  ))
                ) : (
                  <li className="py-2 text-gray-500">No profiles revealed yet.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column - Jobs Posted */}
          <div className="md:w-1/2 bg-[#F8F8F8] rounded-lg shadow-sm p-6">
            <div>
              {selectedSeeker ? (
                <ViewSeekerProfileModal
                  isOpen={true}
                  seekerData={selectedSeeker.seeker}
                  onClose={handleCloseViewProfile}
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#254159]">Jobs Posted</h2>
                    <button
                      onClick={() => navigate("/business/jobs/create")}
                      className="bg-[#f2be5c] hover:bg-[#e3aa3c] text-white font-medium px-4 py-2 rounded-md transition"
                    >
                      Create Job
                    </button>
                  </div>
                  <div className="space-y-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Recent Jobs Posted</h3>
                    <ul className="space-y-4 mt-4">
                      {loading ? (
                        <p className="text-gray-500">Loading jobs...</p>
                      ) : jobs.length > 0 ? (
                        jobs.map((job) => (
                          <li
                            key={job.id}
                            className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col gap-2"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-lg font-bold text-[#254159]">
                                  {job.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {job.employmentType} | Start: {job.startDate || "TBA"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => navigate(`/business/jobs/edit/${job.id}`)}
                                  className="bg-[#f2be5c] hover:bg-[#e3aa3c] text-white font-semibold px-4 py-1.5 rounded-md transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="bg-[#e57373] hover:bg-[#d64b4b] text-white font-semibold px-4 py-1.5 rounded-md transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate(`/business/jobs/view/${job.id}`)}
                              className="text-sm text-[#254159] underline hover:text-[#f2be5c]"
                            >
                              View Job Details
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">You have not posted any jobs yet.</li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessActivity;
