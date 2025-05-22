const JobDetailPanel = ({ job }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h2 className="text-2xl font-bold text-[#254159] mb-2">{job.title}</h2>
      <p className="text-sm text-gray-600 mb-1">
        📍 {job.location} | 💼 {job.jobType} | 📅 Start: {job.startDate || "TBA"}
      </p>
      <p className="text-sm text-gray-500 mb-4">Posted by: {job.company || "Unknown"}</p>

      <div className="text-sm text-gray-700 space-y-2">
        <p><strong>Schedule:</strong> {job.schedule}</p>
        <p><strong>Description:</strong><br /> {job.description}</p>
        <p><strong>Requirements:</strong><br /> {job.requirements}</p>
        {job.payRate && <p><strong>Pay Rate:</strong> {job.payRate}</p>}
        {job.contactInstructions && <p><strong>Contact Instructions:</strong> {job.contactInstructions}</p>}
      </div>

      <div className="mt-6">
        <button className="bg-[#26425A] hover:bg-[#f2be5c] text-white font-medium px-6 py-2 rounded-md transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetailPanel;
