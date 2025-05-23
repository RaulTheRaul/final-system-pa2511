import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";

import ConfirmRevealModal from "./ConfirmRevealModal";


const SeekerCard = ({ seekerInfo }) => {
  //Set variables for later use
  const [showContact, setShowContact] = useState(null); //Stores contact info
  const [revealed, setRevealed] = useState(false); //for revealing button
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [allowMessage, setAllowMessage] = useState(false); //for message system
  const { currentUser } = useAuth();

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
  }

  //This function will handle the message system
  //Note: This function will be added later
  const handleMessage = () => {
    //add here

  };

  return (
    //display basic seeker information
    <div className="border-2 border-gray-400 p-4 rounded shadow mb-4 bg-white">
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
          <p>{seekerInfo?.email || 'Email not provided'}</p>
        </div>
      )} 
     
      {/* Button Section*/}
      {/* Displays the reveal button and disables it if loaded or revealed. */}
        <div className="flex justify-end mt-4">
          {!revealed && (
            <button
              className= {`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                       bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent
                       ${(loading || revealed) ? ' ' : ''}`}
              onClick={handleRevealClick}
              disabled={loading || revealed} //disable button once revealed.
            >
              {loading ? 'Revealing...' :'Reveal Profile'}
            </button>
            )}
          {revealed && (
            <div className="flex space-x-2">
              <button
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                       bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent"
              onClick={()=>console.log("View profile clicked", seekerInfo.id)}
              >
                View Profile
              </button>

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

      {/* Rendering the confirmation modal */}
        <ConfirmRevealModal
        isOpen={showConfirmation}
        onConfirm={handleRevealContact}
        onCancel={handleCancelReveal}
        isLoading={loading}
        title="Confirm Action"
        message="Are you sure? This will deduct 5 credits from your account."
        />

    </div>
      
  )}

export default SeekerCard;