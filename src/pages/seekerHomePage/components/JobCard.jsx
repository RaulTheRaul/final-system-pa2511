<<<<<<< HEAD
import { useAuth } from "../../../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useState, useEffect } from "react";
import toast from "react-hot-toast"; // Toast

const JobCard = ({ job, alreadyApplied = false }) => {
  const { currentUser } = useAuth();
  const [applied, setApplied] = useState(false);

  // Sync with props
  useEffect(() => {
    setApplied(alreadyApplied);
  }, [alreadyApplied]);

  const handleApply = async () => {
    if (!currentUser) return;

    try {
      await setDoc(doc(db, "applications", `${currentUser.uid}_${job.id}`), {
        userId: currentUser.uid,
        jobId: job.id,
        jobTitle: job.title,
        appliedAt: new Date(),
        postedBy: job.postedBy || "Unknown",
      });

      setApplied(true);
      toast.success("✅ Application sent successfully!");
    } catch (error) {
      console.error("Failed to apply:", error);
      toast.error("❌ Something went wrong. Please try again.");
    }
=======
const JobCard = ({ job }) => {
    return (
      <div className="border p-4 rounded shadow mb-4 bg-[#EEEEEE]">
        <h3 className="text-xl font-semibold text-[#254159]">{job.title}</h3>
        <p className="text-gray-700">Location: {job.location}</p>
        <p className="text-gray-600">{job.description}</p>
        <p className="mt-2 text-sm text-gray-500">Posted by: {job.postedBy}</p>
      </div>
    );
>>>>>>> 52b7e3de9b68ad37fdd1c29badceaddf64b5ca3c
  };

  return (
    <div className="border p-4 rounded shadow mb-4 bg-white">
      <h3 className="text-xl font-semibold text-blue-800">{job.title}</h3>
      <p className="text-gray-700">
        📍 <strong>Location:</strong> {job.location}
      </p>
      <p className="text-gray-600 mt-2">{job.description}</p>
      <p className="mt-2 text-sm text-gray-500">
        👤 <strong>Posted by:</strong> {job.postedBy}
      </p>

      <button
        onClick={handleApply}
        disabled={applied}
        className={`mt-4 px-5 py-2 rounded-md text-sm font-medium transition duration-200 ${
          applied
            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {applied ? "✅ Applied" : "Apply"}
      </button>
    </div>
  );
};

export default JobCard;
