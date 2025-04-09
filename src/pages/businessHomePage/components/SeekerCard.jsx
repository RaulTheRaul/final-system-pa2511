const SeekerCard = () => {
    
    //Get job seeker information
    const seekerInfo = userData?.seekerInformation || {};

return (
    //display basic seeker information
    <div className = "border p-4 rounded shadow mb-4 bg-white">
        <h3 className="text-xl font-semibold">{seekerInfo?.fullName}</h3>
        <p className="text-gray-700">Availability: {seekerInfo?.avaiability}</p>
        <p className="text-gray-700">Shift Preference: {seekerInfo?.shiftPreference}</p>
        <p className="text-gray-600">Start: {seekerInfo?.immediateStart}</p>
        <p className="text-gray-600">Transport: {seekerInfo?.transportMethod}</p>
        <p className="text-gray-600">Bio: {seekerInfo?.bio}</p>
    </div>
);

};

export default SeekerCard;