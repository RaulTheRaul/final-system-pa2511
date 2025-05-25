import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import BusinessNavigation from "./components/BusinessNavigation";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateJobPage = () => {
  const { currentUser, userData } = useAuth();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [newJob, setNewJob] = useState({
    title: "",
    positionOverview: "",
    responsibilities: "",
    qualifications: "",
    employmentType: "",
    startDate: "",
    contractDuration: "",
    applicationClosingDate: "",
    rosterCycle: "",
    flyInLocations: "",
    destinationLocation: "",
    transportInclusions: "",
    accommodationType: "",
    accommodationCosts: "",
    mealsProvided: "",
    hourlyRate: "",
    allowances: "",
    bonus: "",
    developmentOpportunities: ""
  });

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!newJob.title) newErrors.title = "Job title is required";
      if (!newJob.positionOverview) newErrors.positionOverview = "Overview is required";
      if (!newJob.responsibilities) newErrors.responsibilities = "Responsibilities are required";
    }
    if (step === 2) {
      if (!newJob.qualifications) newErrors.qualifications = "Qualifications are required";
      if (!newJob.employmentType) newErrors.employmentType = "Employment type is required";
      if (!newJob.startDate) newErrors.startDate = "Start date is required";
      if (!newJob.applicationClosingDate) newErrors.applicationClosingDate = "Closing date is required";
    }
    if (step === 4) {
      if (!newJob.hourlyRate) newErrors.hourlyRate = "Hourly rate is required";
      if (!newJob.allowances) newErrors.allowances = "Allowances are required";
      if (!newJob.bonus) newErrors.bonus = "Bonuses are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 4) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    try {
      await addDoc(collection(db, "jobs"), {
        ...newJob,
        businessId: currentUser.uid,
        company: userData?.businessName || "Unknown",
        createdAt: serverTimestamp()
      });
      toast.success("✅ Job posted successfully!");
      navigate("/business/activity");
    } catch (err) {
      console.error("Failed to post job:", err);
      toast.error("❌ Failed to post job");
    }
  };

  const inputClass = (field) =>
    `w-full border px-3 py-2 rounded-md shadow-sm ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="min-h-screen bg-[#f2ece4]">
      <BusinessNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && step < 4) {
              e.preventDefault();
            }
          }}
          className="bg-white p-6 rounded-lg shadow-lg space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-[#254159]">📝 Post a New Job</h2>
          <p className="text-sm text-gray-500 mb-4">Step {step} of 4</p>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Job Title</label>
                <input name="title" value={newJob.title} onChange={handleChange} className={inputClass("title")} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Position Overview</label>
                <textarea name="positionOverview" value={newJob.positionOverview} onChange={handleChange} rows="3" className={inputClass("positionOverview")} />
                {errors.positionOverview && <p className="text-red-500 text-sm">{errors.positionOverview}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Key Responsibilities</label>
                <textarea name="responsibilities" value={newJob.responsibilities} onChange={handleChange} rows="4" className={inputClass("responsibilities")} />
                {errors.responsibilities && <p className="text-red-500 text-sm">{errors.responsibilities}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <input name="qualifications" value={newJob.qualifications} onChange={handleChange} placeholder="Qualifications" className={inputClass("qualifications")} />
              {errors.qualifications && <p className="text-red-500 text-sm">{errors.qualifications}</p>}
              <input name="employmentType" value={newJob.employmentType} onChange={handleChange} placeholder="Employment Type" className={inputClass("employmentType")} />
              {errors.employmentType && <p className="text-red-500 text-sm">{errors.employmentType}</p>}
              <input name="startDate" type="date" value={newJob.startDate} onChange={handleChange} className={inputClass("startDate")} />
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
              <select
                name="contractDuration"
                value={newJob.contractDuration}
                onChange={handleChange}
                className={inputClass("contractDuration")}
              >
                <option value="">Select Contract Duration</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Negotiable">Negotiable</option>
              </select>

              <input name="applicationClosingDate" type="date" value={newJob.applicationClosingDate} onChange={handleChange} className={inputClass("applicationClosingDate")} />
              {errors.applicationClosingDate && <p className="text-red-500 text-sm">{errors.applicationClosingDate}</p>}
              

            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <input name="rosterCycle" value={newJob.rosterCycle} onChange={handleChange} placeholder="Roster Cycle" className={inputClass("rosterCycle")} />
              <input name="flyInLocations" value={newJob.flyInLocations} onChange={handleChange} placeholder="Fly-In Locations" className={inputClass("flyInLocations")} />
              <input name="destinationLocation" value={newJob.destinationLocation} onChange={handleChange} placeholder="Destination Location" className={inputClass("destinationLocation")} />
              <input name="transportInclusions" value={newJob.transportInclusions} onChange={handleChange} placeholder="Transport Inclusions" className={inputClass("transportInclusions")} />
              <input name="accommodationType" value={newJob.accommodationType} onChange={handleChange} placeholder="Accommodation Type" className={inputClass("accommodationType")} />
              <input name="accommodationCosts" value={newJob.accommodationCosts} onChange={handleChange} placeholder="Accommodation Costs" className={inputClass("accommodationCosts")} />
              <input name="mealsProvided" value={newJob.mealsProvided} onChange={handleChange} placeholder="Meals Provided" className={inputClass("mealsProvided")} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <input name="hourlyRate" value={newJob.hourlyRate} onChange={handleChange} placeholder="Hourly Rate" className={inputClass("hourlyRate")} />
              {errors.hourlyRate && <p className="text-red-500 text-sm">{errors.hourlyRate}</p>}
              <input name="allowances" value={newJob.allowances} onChange={handleChange} placeholder="Allowances" className={inputClass("allowances")} />
              {errors.allowances && <p className="text-red-500 text-sm">{errors.allowances}</p>}
              <input name="bonus" value={newJob.bonus} onChange={handleChange} placeholder="Bonuses" className={inputClass("bonus")} />
              {errors.bonus && <p className="text-red-500 text-sm">{errors.bonus}</p>}
              <input name="developmentOpportunities" value={newJob.developmentOpportunities} onChange={handleChange} placeholder="Professional Development" className={inputClass("developmentOpportunities")} />
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="text-sm text-[#254159] border border-[#254159] px-4 py-2 rounded hover:bg-[#f2be5c] hover:text-white">Back</button>
            )}
            {step < 4 ? (
              <button type="button" onClick={handleNext} className="text-sm bg-[#f2be5c] hover:bg-[#e3aa3c] text-white px-6 py-2 rounded">Next</button>
            ) : (
              <button type="submit" className="text-sm bg-[#f2be5c] hover:bg-[#e3aa3c] text-white px-6 py-2 rounded">Post Job</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;
