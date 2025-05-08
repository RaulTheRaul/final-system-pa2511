import { useState } from "react";


const SeekerCard = ({ seekerInfo }) => {
  //Set variables for later use
  const [showContact, setShowContact] = useState(false); //for contact info
  const [allowMessage, setAllowMessage] = useState(false); //for message system

  //This function will handle the the token system
  const handleRevealContact = () => {
    //add here

    setShowContact(true);
    setAllowMessage(true);
  };

  //This function will handle the message system
  //Note: This function will be added later
  const handleMessage = () => {
    //add here

  };

  return (
    //display basic seeker information
    <div className="border p-4 rounded shadow mb-4 bg-white">
      <h3 className="text-xl font-semibold">{seekerInfo?.jobseekerInformation?.educationLevel || 'Not provided'}</h3>
      <p className="text-gray-700">Availability: {seekerInfo?.jobseekerInformation?.availability || 'Not provided'}</p>
      <p className="text-gray-700">Shift Preference: {seekerInfo?.jobseekerInformation?.shiftPreference || 'Not provided'}</p>
      <p className="text-gray-600">Start: {seekerInfo?.jobseekerInformation?.immediateStart || 'Not provided'}</p>
      <p className="text-gray-600">Transport: {seekerInfo?.jobseekerInformation?.transportMethod || 'Not provided'}</p>

      {/*When contact button is pressed*/}
      {showContact && (
        <div className="mt-4">
          <h4 className="font-semibold">Contact Information:</h4>
          <p>{seekerInfo?.email || 'Email not provided'}</p>
        </div>
      )}

      <div className="flex justify-end">
        {allowMessage ? (
          <button
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                     bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent"
            onClick={handleMessage}
          >
            Message
          </button>
        ) : (
          <button
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                     bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent"
            onClick={handleRevealContact}
          >
            5 tokens to reveal contact information
          </button>
        )}
      </div>
    </div>
  );
};

export default SeekerCard;