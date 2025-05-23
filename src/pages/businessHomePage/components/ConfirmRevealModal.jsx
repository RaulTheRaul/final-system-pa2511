
/*

*/
const ConfirmRevealModal = ({isOpen, onConfirm, onCancel, isLoading, title="Confirm Action", message="Are you sure? This will deduct 5 credits from your account."}) => {
    if (!isOpen) {
        return null; //Dont render model if not open
    }
return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px]">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border-2 border-gray-400 ">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-gray-300 bg-gray-100 hover:bg-gray-200"
            onClick={onCancel}
            disabled={isLoading} // Disable cancel button if confirmation is loading
          >
            Cancel
          </button>
          <button
            // Applied theme colors for the Confirm button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                        bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onConfirm}
            disabled={isLoading} // Disable confirm button if confirmation is loading
          >
            {isLoading ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
)};

export default ConfirmRevealModal;