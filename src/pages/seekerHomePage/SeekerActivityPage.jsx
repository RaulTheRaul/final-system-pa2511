import SeekerNavigation from "./components/SeekerNavigation";

const SeekerActivityPage = () => {
    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <SeekerNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-[#254159] mb-6">Your Activity</h2>

                    <div className="bg-[#EEEEEE] p-8 rounded-lg text-center">
                        <p className="text-gray-600 mb-3">You don't have any recent activity.</p>
                        <p className="text-gray-500 text-sm">
                            When you apply for jobs or save job listings, they will appear here.
                        </p>
                    </div>

                    {/* Future implementation: List of applications, saved jobs, etc. */}
                    {/* 
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Recent Applications</h3>
            <div>
              [Applications list would go here]
            </div>
            
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">Saved Jobs</h3>
            <div>
              [Saved jobs list would go here]
            </div>
          </div>
          */}
                </div>
            </div>
        </div>
    );
};

export default SeekerActivityPage;