const JobCard = ({
  job,
  applied,
  saved,
  handleApply,
  handleSave,
  handleUnsave
}) => {
  return (
    <div className="bg-[#F1EEEB] border border-[#DDD] rounded-lg shadow-sm p-6 transition hover:shadow-md relative">
      {/* ❤️ Save/Unsave button in the corner */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent click conflicts
          saved ? handleUnsave() : handleSave();
        }}
        className="absolute top-4 right-4 text-xl z-10 cursor-pointer hover:scale-110 transition-transform duration-150"
        title={saved ? "Unsave Job" : "Save Job"}
      >
        {saved ? "❤️" : "🤍"}
    </button>

      

      <h3 className="text-xl font-semibold text-[#254159] mb-2">{job.title}</h3>
      <p className="text-sm text-gray-700 mb-1">
        📍 <span className="font-medium">Location:</span> {job.location}
      </p>
      <p className="text-sm text-gray-600 mb-2">{job.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        👤 <span className="font-medium">Posted by:</span>{" "}
        {job.postedBy || "Unknown"}
      </p>

      <button
        onClick={handleApply}
        disabled={applied}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border ${
          applied
            ? "bg-gray-300 text-gray-600 cursor-not-allowed border-gray-300"
            : "bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent"
        }`}
      >
        {applied ? "✅ Applied" : "Apply"}
      </button>
    </div>
  );
};

export default JobCard;
