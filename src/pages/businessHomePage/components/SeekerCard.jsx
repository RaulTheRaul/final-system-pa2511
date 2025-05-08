const SeekerCard = ({ recruited }) => {

  //Get job seeker information
  const seekerInfo = userData?.seekerInformation || {};

  return (
    //display basic seeker information
    <div className="border p-4 rounded shadow mb-4 bg-white">
      <h3 className="text-xl font-semibold">{seekerInfo?.fullName}</h3>
      <p className="text-gray-700">Availability: {seekerInfo?.avaiability}</p>
      <p className="text-gray-700">Shift Preference: {seekerInfo?.shiftPreference}</p>
      <p className="text-gray-600">Start: {seekerInfo?.immediateStart}</p>
      <p className="text-gray-600">Transport: {seekerInfo?.transportMethod}</p>
      <p className="text-gray-600">Bio: {seekerInfo?.bio}</p>

      <button
        onClick={handleRecruit}
        disabled={recruited}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border ${recruited
            ? "bg-gray-300 text-gray-600 cursor-not-allowed border-gray-300"
            : "bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent"
          }`}
      >
        {recruited ? "✅ Recruited" : "Not Recruited"}
      </button>
    </div>
  );

};

export default SeekerCard;