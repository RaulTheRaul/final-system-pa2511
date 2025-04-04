const SeekerCard = ({ users }) => {
    const seekerInfo = userData?.seekerInformation || {};

return (
    <div className = "border p-4 rounded shadow mb-4 bg-white">
        <h3>{seekerInfo?.fullName}</h3>
        <p>Availability: {seekerInfo?.avaiability}</p>
        <p>Start: {seekerInfo?.immediateStart}</p>
        <p>Transport: {seekerInfo?.transportMethod}</p>
        <p>Bio: {seekerInfo?.bio}</p>

    </div>
);

};

export default SeekerCard;