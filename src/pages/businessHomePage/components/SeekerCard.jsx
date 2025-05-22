import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";


const SeekerCard = ({ seekerInfo }) => {
  //Set variables for later use
  const [showContact, setShowContact] = useState(null); //Stores contact info
  const [revealed, setRevealed] = useState(false); //for revealing button
  const [loading, setLoading] = useState(false)
  const [allowMessage, setAllowMessage] = useState(false); //for message system
  const { currentUser } = useAuth();

   //This fucntion will make sure the reveal contact is only pressed once and will prevent the business from being charged
  useEffect(()=>{
    const checkRevealStatus = async () =>{
      if (!currentUser) return;

      try {
        const q = query(
          collection(db, "revealedTest"),
          where("businessId", "==", currentUser.uid),
          where("seekerId", "==", seekerInfo.id)
        );
        const querySnapshot = await getDocs(q);

        //if document exists update show contact
        if(querySnapshot.docs.length > 0) {
          setRevealed(true);
          setShowContact( {email: seekerInfo.email});
        }
      } catch (err) {
        console.log("error checking reveal status", err);
      } finally {
        setLoading(false);
      }
    };
    checkRevealStatus();
  }, [currentUser, db]);
      
  //This function will handle the the token system and recent applicants
  const handleRevealContact = async () => {
     if (loading || revealed ) return; // Prevent revealing if already loading or revealed
     if (!currentUser) return;

    //const revealedContact = collection (db, "revealedTest");
    const seekerId = seekerInfo.id;

    try {
      //check information again.
      const q = query(
        collection(db, "revealedTest"),
        where("businessId", "==", currentUser.uid),
        where("seekerId", "==", seekerInfo.id)
      );
      const existingReveals = await getDocs(q);

      //if document exists update show contact
      if(existingReveals.docs.length > 0) {
        setRevealed(true);
        setShowContact({email: seekerInfo.email});
        return;
      }
      
      //Add new document in revealedTest database for new reveals
      await addDoc(collection(db,"revealedTest"), {
        businessId: currentUser.uid,
        createdAt: serverTimestamp(),
        seekerId: seekerId
      });

      setShowContact(true);
      console.log("contact revealed")
      setAllowMessage(true);
      
    } catch (err){
      console.error("Error revealing contact", err);
    }
    //add here
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
    
      {revealed && (
        //If info has been revealed, display 
         <div className="mt-4">
          <h4 className="font-semibold">Contact Information:</h4>
          <p>{seekerInfo?.email || 'Email not provided'}</p>
        </div>
      )} 
     
        <div className="flex justify-end mt-4">
        <button
            className= {`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                     bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent
                     ${(loading || revealed) ? ' ' : ''}`}
            onClick={handleRevealContact}
            disabled={loading || revealed} //disable button once revealed.
          >
            {loading ? 'Revealing...' : (revealed ? 'View Profile' : 'Reveal Profile')}
          </button>
          </div>
    </div>
      
  );
};

export default SeekerCard;