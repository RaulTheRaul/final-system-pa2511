import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";

import ConfirmRevealModal from "./ConfirmRevealModal";

const SeekerCard = ({ seekerInfo, onViewProfile, currentlySelectedProfile, onClosePanel }) => {
  //Set variables for later use
  const [showContact, setShowContact] = useState(null); //Stores contact info
  const [revealed, setRevealed] = useState(false); //for revealing button
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  //const [showProfileModal, setShowProfileModal] = useState(false);

  const [allowMessage, setAllowMessage] = useState(false); //for message system
  const { currentUser } = useAuth();

  //This will check if the seeker panel is selected on the right side
  const isThisProfileSelected = currentlySelectedProfile && currentlySelectedProfile.id == seekerInfo.id;

   //This fucntion will make sure the reveal contact is only pressed once and will prevent the business from being charged
  useEffect(()=>{

    let unsubscribe; 

    if(currentUser && currentUser.uid && seekerInfo && seekerInfo.id){
      const q = query(
          collection(db, "revealedTest"),
          where("businessId", "==", currentUser.uid),
          where("seekerId", "==", seekerInfo.id)
        );

        unsubscribe = onSnapshot(q, (snapshot)=>{
          if (snapshot.docs.length > 0) {
          setRevealed(true);
          setShowContact( {email: seekerInfo.email});
          } else {
            setRevealed(false);
            setShowContact(null);
          }
        }, (error) => {
      console.error("Error listening to seeker reveal status:", error);
     });
    }
      return() =>{
        if(unsubscribe){
          unsubscribe();
        }
      }
    }, [currentUser, seekerInfo?.id, db, seekerInfo]);

    
  //This function will handle the initial click of the reveal button
  const handleRevealClick = () => {
    if ( loading || revealed ) return; //prevents action if already loading or revealed
    if (!currentUser) return;
    setShowConfirmation(true); 
  }

  //This function will handle the recent applicants and confirmation
  const handleRevealContact = async () => {
     if (loading || revealed ) return; // Prevent revealing if already loading or revealed
     if (!currentUser) return;

     setShowConfirmation(false);
     setLoading(true);

    //const revealedContact = collection (db, "revealedTest");
    const seekerId = seekerInfo.id;

    try {
      //query into collection and get information again.
      const q = query(
        collection(db, "revealedTest"),
        where("businessId", "==", currentUser.uid),
        where("seekerId", "==", seekerInfo.id)
      );

      //Add new document in revealedTest database for new reveals
      await addDoc(collection(db,"revealedTest"), {
        businessId: currentUser.uid,
        createdAt: serverTimestamp(),
        seekerId: seekerId
      });

//Maybe adding token deduction logic here
      


      setShowContact(true);
      console.log("contact revealed")
      setAllowMessage(true);
      
    } catch (err){
      console.error("Error revealing contact", err);
    } finally {
      setLoading(false);
    }
  };

  //This function will enable the closure of the confirmation modal
  const handleCancelReveal = () => {
    setShowConfirmation(false);
  };

 //Displays profile on right panel and toggles based on current selection.
  const handleViewProfileClick = () => {
    if(isThisProfileSelected) { 
      onClosePanel(); //if profile is selected, close profile
      } else if (onViewProfile) {
      onViewProfile(seekerInfo); //otherwise open profile
    };
  };

  //This function will handle the message system
  //Note: This function will be added later
  const handleMessage = () => {
    //add here

  };

  return (
    //display basic seeker information
    <div className="bg-white rounded-md shadow-md p-4 mb-4">
      <div>
      <h3 className="text-xl font-semibold">{seekerInfo?.jobseekerInformation?.educationLevel || 'Not provided'}</h3>
      <p className="text-gray-700">Availability: {seekerInfo?.jobseekerInformation?.availability || 'Not provided'}</p>
      <p className="text-gray-700">Shift Preference: {seekerInfo?.jobseekerInformation?.shiftPreference || 'Not provided'}</p>
      <p className="text-gray-600">Hourly Rate: {seekerInfo?.jobseekerInformation?.desiredPayRate || 'Not provided'}</p>
      <p className="text-gray-600">Location: {seekerInfo?.jobseekerInformation?.location || 'Not provided'}</p>

      {/*When contact button is pressed*/}
      {revealed && (
        //If info has been revealed, display continuously
         <div className="mt-4">
          <h4 className="font-semibold">Contact Information:</h4>
          <p>Name: {seekerInfo?.fullName}</p>
          <p>Email: {seekerInfo?.email || 'Email not provided'}</p>
        </div>
      )} 
     
      {/* Button Section*/}
      {/* Displays the reveal button and disables it if loaded or revealed. */}
        <div className="flex justify-end mt-4">
          {!revealed && (
            <button
              className= {`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                       bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent
                       ${loading ? ' ' : ''}`}
              onClick={handleRevealClick}
              disabled={loading} //disable button once revealed.
            >
              {loading ? 'Revealing...' :'Reveal Profile'}
            </button>
            )}

            {/* Buttons that will appear once profile is revealed */}
          {revealed && (
            <div className="flex space-x-2">
              {/* View Profile Button */}
              <button
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                       bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent"
              onClick={handleViewProfileClick} 
              >
                {isThisProfileSelected ? "Hide Profile" : "View Profile"}
              </button>

              {/* Message Button */}
              <button
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                       bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent"
              onClick={()=>console.log("Message Seeker clicked", seekerInfo.id)}
              >
                Message {seekerInfo.fullName}
              </button>
              </div>
          )}
        </div>
      </div>

      {/* Rendering the confirmation modal */}
        <ConfirmRevealModal
        isOpen={showConfirmation}
        onConfirm={handleRevealContact}
        onCancel={handleCancelReveal}
        isLoading={loading}
        title="Confirm Profile Reveal"
        message="Are you sure? This will deduct 5 credits from your account."
        />

      {/* Render the View Profile modal
          <ViewSeekerProfileModal
            isOpen={showProfileModal}
            onClose={handleCloseProfileModal}
            seekerData={seekerInfo} //give seekerInfo to seekerData
          />
          */}
    </div>
  )}

export default SeekerCard;