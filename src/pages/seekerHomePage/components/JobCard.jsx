const JobCard = ({ job, saved, handleSave, handleUnsave, onView }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative transition hover:shadow-md">
      {/* ❤️ Save/Unsave button in top right corner */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent card click
          saved ? handleUnsave() : handleSave();
        }}
        className="absolute top-4 right-4 text-xl cursor-pointer hover:scale-110 transition-transform"
        title={saved ? "Unsave Job" : "Save Job"}
      >
        {saved ? "❤️" : "🤍"}
      </button>

      <h3 className="text-lg font-semibold text-[#254159] mb-1">{job.title}</h3>
      <p className="text-sm text-gray-600 mb-1">
        📍 {job.location} | 💼 {job.jobType} | 📅 Start: {job.startDate || "TBA"}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Posted by: {job.company || "Unknown"}
      </p>
      <p className="text-sm text-gray-700 line-clamp-3 mb-4">
        {job.description}
      </p>

      <div className="flex justify-end">
        <button
          onClick={onView}
          className="px-4 py-2 bg-[#26425A] text-white rounded-md text-sm hover:bg-[#f2be5c] transition"
        >
          View Job
        </button>
      </div>
    </div>
  );
};

export default JobCard;
