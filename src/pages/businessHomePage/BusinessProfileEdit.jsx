import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import BusinessNavigation from "./components/BusinessNavigation";

// Import Firebase Storage functions
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // For unique file names

//Import business sections
import BusinessInfoSection from "../businessHomePage/components/businessProfile/BusinessInfoSection";
import CentreSection from "../businessHomePage/components/businessProfile/CentreSection";
import BusinessAdditionalInfoSection from "../businessHomePage/components/businessProfile/BusinessAdditionalInfoSection";

const storage = getStorage(); // Initialize Firebase Storage

const BusinessProfileEdit = () => {
    const { currentUser, userData, getUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const errorRef = useRef(null); // Ref for scrolling to error

    //Get business information from userData
    const businessInfo = userData?.businessInformation || {};

    //Form a state with default values

    const [formData, setFormData] = useState({
        //Business Information
        businessName: "",
        aceqcaRating: "",
        licenseNumber: "",

        //Centre Information
        centreName: "",
        centreAddress: "",
        centrePhone: "",
        operatingHours: "",
        centreType: "",
        websiteUrl: "",
        centreCapacity: "",
        staffToChildRatio: "",
        centreDescription: "",

        //Staff Benefits
        staffBenefits: "",
        careerOpportunities: ""
    });

    // State for file uploads
    const [logoFile, setLogoFile] = useState(null);
    const [centreImageFiles, setCentreImageFiles] = useState([]); // Files selected for upload (new)
    const [logoUrl, setLogoUrl] = useState(businessInfo.logoUrl || ""); // URL of existing logo
    const [centreImageUrls, setCentreImageUrls] = useState(businessInfo.centreImageUrls || []); // URLs of existing centre images
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    //Update form data and image URLs when userData changes or on component mount
    useEffect(() => {
        if (userData && businessInfo) {
            setFormData({
                //Business Information
                businessName: userData.businessName || "",
                aceqcaRating: businessInfo.aceqcaRating || "",
                licenseNumber: businessInfo.licenseNumber || "",

                //Centre Information
                centreName: businessInfo.centreName || "",
                centreAddress: businessInfo.centreAddress || "",
                centrePhone: businessInfo.centrePhone || "",
                operatingHours: businessInfo.operatingHours || "",
                centreType: businessInfo.centreType || "",
                centreCapacity: businessInfo.centreCapacity || "",
                websiteUrl: businessInfo.websiteUrl || "",
                staffToChildRatio: businessInfo.staffToChildRatio || "",
                centreDescription: businessInfo.centreDescription || "",

                //Staff Benefits
                staffBenefits: Array.isArray(businessInfo.staffBenefits)
                    ? businessInfo.staffBenefits.join(", ")
                    : businessInfo.staffBenefits || "",

                careerOpportunities: businessInfo.careerOpportunities || ""
            });
            // Ensure URLs are updated correctly from existing data
            setLogoUrl(businessInfo.logoUrl || "");
            setCentreImageUrls(businessInfo.centreImageUrls || []);
        }

    }, [userData, businessInfo]);

    // Scroll to top on error
    useEffect(() => {
        if (error && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [error]);

    //captures user input and changes inputted data when user submits the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked
        });
    };

    const handleCancel = () => {
        navigate("/business/profile");
    };

    // Handle logo file selection
    const handleLogoFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setLogoFile(null);
            setError("");
            return;
        }
        const MAX_LOGO_SIZE_MB = 1;
        const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

        if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
            setError(`Logo size exceeds ${MAX_LOGO_SIZE_MB}MB. Please choose a smaller file.`);
            e.target.value = ''; // Clear the input
            setLogoFile(null);
            return;
        }

        if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
            setError(`Invalid logo file type. Only JPG, PNG, GIF are allowed.`);
            e.target.value = ''; // Clear the input
            setLogoFile(null);
            return;
        }

        setLogoFile(file);
        setError(""); // Clear any previous error specific to image upload limits
    };

    // Handle centre image file selection
    const handleCentreImageFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const MAX_CENTRE_IMAGE_SIZE_MB = 2;
        const ALLOWED_CENTRE_IMAGE_TYPES = ['image/jpeg', 'image/png'];
        let newFilesToUpload = [];
        let hasError = false;
        let errorMessage = "";

        // First, check file size and type for each selected file
        for (const file of selectedFiles) {
            if (file.size > MAX_CENTRE_IMAGE_SIZE_MB * 1024 * 1024) {
                errorMessage = `File "${file.name}" exceeds ${MAX_CENTRE_IMAGE_SIZE_MB}MB.`;
                hasError = true;
                break;
            }
            if (!ALLOWED_CENTRE_IMAGE_TYPES.includes(file.type)) {
                errorMessage = `Invalid file type for "${file.name}". Only JPG, PNG are allowed.`;
                hasError = true;
                break;
            }
            newFilesToUpload.push(file);
        }

        if (hasError) {
            setError(errorMessage);
            e.target.value = ''; // Clear the input
            return;
        }

        const totalImages = centreImageUrls.length + centreImageFiles.length + newFilesToUpload.length;

        if (totalImages > 3) {
            setError(`You can upload a maximum of 3 centre images. You have ${centreImageUrls.length} existing, ${centreImageFiles.length} selected, and tried to add ${newFilesToUpload.length}.`);
            e.target.value = ''; // Clear the input
            return;
        }

        setCentreImageFiles((prevFiles) => [...prevFiles, ...newFilesToUpload]);
        setError(""); // Clear error if selection is valid
        e.target.value = ''; // Clear the input for subsequent selections
    };

    // Function to remove a NEWLY SELECTED image (before upload)
    const handleRemoveSelectedImage = (indexToRemove) => {
        setCentreImageFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
        setError(""); // Clear error if user removes a file
    };

    // Upload a single file to Firebase Storage
    const uploadFile = async (file, path) => {
        if (!file) return null;

        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`; // Correct way to generate unique file name
        const storageRef = ref(storage, `${path}/${currentUser.uid}/${fileName}`); // Correct path construction
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    // Remove an image (logo or centre image)
    const handleRemoveImage = async (urlToRemove, type) => {
        setError("");
        setSuccess(false);
        if (!urlToRemove) return;

        try {
            setLoading(true);
            // Create a storage reference from the URL
            const imageRef = ref(storage, urlToRemove);
            await deleteObject(imageRef);

            let updatedLogoUrl = logoUrl;
            let updatedCentreImageUrls = centreImageUrls; // Start with current state for update

            if (type === 'logo') {
                updatedLogoUrl = null;
                setLogoUrl(null); // Update state
                setLogoFile(null); // Clear any pending file too
            } else if (type === 'centreImage') {
                updatedCentreImageUrls = centreImageUrls.filter(url => url !== urlToRemove);
                setCentreImageUrls(updatedCentreImageUrls); // Update state
            }
            setSuccess(true); // Indicate successful removal to the user
            setError(""); // Clear any previous errors

            // Update Firestore immediately after deletion
            const userDocRef = doc(db, "users", currentUser.uid);
            await setDoc(
                userDocRef,
                {
                    businessInformation: {
                        logoUrl: updatedLogoUrl, // Use the updated variable
                        centreImageUrls: updatedCentreImageUrls, // Use the updated variable
                    },
                    updatedAt: new Date()
                },
                { merge: true }
            );
            await getUserData(currentUser.uid); // Refresh user data after deletion

        } catch (err) {
            console.error(`Error removing ${type}:`, err);
            setError(`Failed to remove ${type}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    //This function will talk to the database when the user submits their changes.
    //It will update any values on the database and validate required fields.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        //Basic Validation
        if (!formData.businessName || !formData.centreName || !formData.centreAddress) {
            setError("Please fill out all required fields");
            setLoading(false);
            return;
        }

        try {
            let finalLogoUrl = logoUrl;
            if (logoFile) {
                // Ensure currentUser.uid is available before attempting upload
                if (!currentUser?.uid) {
                    throw new Error("User not authenticated for upload.");
                }
                finalLogoUrl = await uploadFile(logoFile, "businessLogos");
            }

            let newCentreImageUrls = [...centreImageUrls];
            // Upload newly selected files
            for (const file of centreImageFiles) {
                if (newCentreImageUrls.length < 3) { // Ensure max 3
                    // Ensure currentUser.uid is available before attempting upload
                    if (!currentUser?.uid) {
                        throw new Error("User not authenticated for upload.");
                    }
                    const url = await uploadFile(file, "centreImages");
                    if (url) {
                        newCentreImageUrls.push(url);
                    }
                } else {
                    break; // Stop if max reached
                }
            }

            setUploading(false); // Uploads are done

            //Form data for Firestore
            const staffBenefitsArray = formData.staffBenefits
                ? formData.staffBenefits.split(',').map(benefits => benefits.trim())
                : [];

            //Create updated businessInformation object
            const updatedInfo = {
                //Business Information
                businessName: formData.businessName,
                aceqcaRating: formData.aceqcaRating,
                licenseNumber: formData.licenseNumber,
                logoUrl: finalLogoUrl,

                //Centre Information
                centreName: formData.centreName,
                centreAddress: formData.centreAddress,
                centrePhone: formData.centrePhone,
                operatingHours: formData.operatingHours,
                centreType: formData.centreType,
                websiteUrl: formData.websiteUrl,
                centreCapacity: formData.centreCapacity ? Number(formData.centreCapacity) : null,
                staffToChildRatio: formData.staffToChildRatio,
                centreImageUrls: newCentreImageUrls, // Save the new centre image URLs

                //Staff Benefits
                centreDescription: formData.centreDescription,
                staffBenefits: staffBenefitsArray,
                careerOpportunities: formData.careerOpportunities,

                //Update timestamp
                updatedAt: new Date()
            };

            //if this is a new busiess profile, add createdAt
            if (!currentUser.createdAt) {
                updatedInfo.createdAt = new Date();
            } else {
                updatedInfo.createdAt = businessInfo.createdAt;
            }

            //Update Firestore document
            await setDoc(
                doc(db, "users", currentUser.uid),
                {
                    businessName: formData.businessName,
                    businessInformation: updatedInfo,
                    setupCompleted: true
                },
                { merge: true }
            );

            //Refresh user data
            await getUserData(currentUser.uid);
            setSuccess(true);

            //After delay, redirect back to profile page
            setTimeout(() => {
                navigate("/business/profile");
            }, 1500);

        } catch (err) {
            console.error("Error updating business profile:", err);
            setError("Failed to update business profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <BusinessNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#254159]">Edit Your Profile</h2>
                    </div>

                    {/* Error message display, with ref for scrolling */}
                    {error && (
                        <div ref={errorRef} className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
                            Profile successfully updated! Redirecting to profile page...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Business Information Section */}
                        <BusinessInfoSection
                            formData={formData}
                            handleChange={handleChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />

                        {/*Centre Information Section*/}
                        <CentreSection
                            formData={formData}
                            handleChange={handleChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />

                        {/* Business Additional Info Section */}
                        <BusinessAdditionalInfoSection
                            formData={formData}
                            handleChange={handleChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                        {/* Business Logo Upload Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Business Logo</h3>
                            <div className="space-y-4">
                                {logoUrl ? (
                                    <div className="flex items-center space-x-4">
                                        <img src={logoUrl} alt="Business Logo" className="w-24 h-24 object-contain rounded-md border border-gray-300 p-1" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(logoUrl, 'logo')}
                                            disabled={loading}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            Remove Logo
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 mb-1">
                                            Upload Logo (Max 1MB, JPG/PNG/GIF)
                                        </label>
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={handleLogoFileChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Centre Images Upload Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Centre Images (Max 3)</h3>
                            <div className="space-y-4">
                                {/* Display Existing Images */}
                                {centreImageUrls.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {centreImageUrls.map((url, index) => (
                                                <div key={url} className="relative group w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden border border-gray-300">
                                                    <img src={url} alt={`Centre Image ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(url, 'centreImage')}
                                                        disabled={loading}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        aria-label={`Remove image ${index + 1}`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Display Newly Selected Images */}
                                {centreImageFiles.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Selected for upload:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {centreImageFiles.map((file, index) => (
                                                <div key={file.name + index} className="relative group w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100 text-gray-600 text-xs p-1 text-center">
                                                    <span>{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSelectedImage(index)}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        aria-label={`Remove selected image ${file.name}`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {/* File Input for new images */}
                                {(centreImageUrls.length + centreImageFiles.length < 3) && (
                                    <div className="mt-4">
                                        <label htmlFor="centre-image-upload" className="block text-sm font-medium text-gray-700 mb-1">
                                            Upload More Centre Images (Max 3 total, Max 2MB each, JPG/PNG)
                                        </label>
                                        <input
                                            id="centre-image-upload"
                                            type="file"
                                            accept="image/jpeg,image/png"
                                            multiple
                                            onChange={handleCentreImageFileChange}
                                            disabled={(centreImageUrls.length + centreImageFiles.length) >= 3}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            You can upload {3 - (centreImageUrls.length + centreImageFiles.length)} more image(s).
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Uploading progress bar */}
                        {uploading && (
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-md mb-6">
                                Uploading images: {uploadProgress.toFixed(0)}%
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="pt-6 flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-[#EEEEEE] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#26425A] hover:bg-[#f2be5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2be5c] ${loading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BusinessProfileEdit;