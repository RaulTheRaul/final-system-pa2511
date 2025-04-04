
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

//
const BusinessHome = () => {
    const {userData} = useAuth();
    return(
        <div>



            <p>This is the Business Home Page </p>
        </div>
    );
};

export default BusinessHome;