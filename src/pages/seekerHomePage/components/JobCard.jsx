const JobCard = ({ job }) => {
    return (
      <div className="border p-4 rounded shadow mb-4 bg-white">
        <h3 className="text-xl font-semibold">{job.title}</h3>
        <p className="text-gray-700">Location: {job.location}</p>
        <p className="text-gray-600">{job.description}</p>
        <p className="mt-2 text-sm text-gray-500">Posted by: {job.postedBy}</p>
      </div>
    );
  };
  
  export default JobCard;
  