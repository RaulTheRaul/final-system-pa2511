import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
    getAuth,
    updatePassword,
    updateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    verifyBeforeUpdateEmail,
    sendEmailVerification
} from 'firebase/auth';

const AccountSettingsModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const auth = getAuth();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [reauthRequired, setReauthRequired] = useState(false);
    const [verificationEmailSent, setVerificationEmailSent] = useState(false);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

    if (!isOpen) return null;

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setNewEmail('');
        setPasswordMessage('');
        setEmailMessage('');
        setLoading(false);
        setReauthRequired(false);
        // Don't reset verificationEmailSent state to preserve the verification message
    };

    const handleClose = () => {
        resetForm();
        setVerificationEmailSent(false); // Reset verification state on close
        setPasswordChangeSuccess(false); // Reset password change success state on close
        onClose();
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        setLoading(true);
        setPasswordChangeSuccess(false);

        if (newPassword !== confirmNewPassword) {
            setPasswordMessage('New passwords do not match.');
            setLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage('Password should be at least 6 characters.');
            setLoading(false);
            return;
        }

        if (!currentUser) {
            setPasswordMessage('No user logged in.');
            setLoading(false);
            return;
        }

        try {
            // Re-authenticate if required
            if (reauthRequired) {
                const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);
                setReauthRequired(false); // Reset reauth state after successful re-authentication
            }

            await updatePassword(currentUser, newPassword);
            setPasswordChangeSuccess(true);
            setPasswordMessage('Password updated successfully!');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.code === 'auth/requires-recent-login') {
                setPasswordMessage('This operation is sensitive and requires recent authentication. Please enter your current password to proceed.');
                setReauthRequired(true);
            } else if (error.code === 'auth/wrong-password') {
                setPasswordMessage('Incorrect current password.');
            } else if (error.code === 'auth/too-many-requests') {
                setPasswordMessage('Too many failed attempts. Please try again later.');
            } else {
                setPasswordMessage(`Failed to update password: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();
        setEmailMessage('');
        setLoading(true);

        if (!currentUser) {
            setEmailMessage('No user logged in.');
            setLoading(false);
            return;
        }
        if (!newEmail || !newEmail.includes('@') || !newEmail.includes('.')) {
            setEmailMessage('Please enter a valid email address.');
            setLoading(false);
            return;
        }
        if (newEmail === currentUser.email) {
            setEmailMessage('The new email cannot be the same as the current email.');
            setLoading(false);
            return;
        }

        try {
            // Re-authenticate if required
            if (reauthRequired) {
                const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);
                setReauthRequired(false); // Reset reauth state after successful re-authentication
            }

            // Use verifyBeforeUpdateEmail instead of updateEmail
            await verifyBeforeUpdateEmail(currentUser, newEmail);

            // Set verification email sent state to true
            setVerificationEmailSent(true);
            setEmailMessage('Verification email sent to your new address. You MUST check your inbox and click the verification link to complete the change.');
            setNewEmail(''); // Clear email input field but keep message visible
        } catch (error) {
            console.error('Error changing email:', error);
            if (error.code === 'auth/requires-recent-login') {
                setEmailMessage('This operation is sensitive and requires recent authentication. Please enter your current password to proceed.');
                setReauthRequired(true);
            } else if (error.code === 'auth/invalid-email') {
                setEmailMessage('The new email address is not valid.');
            } else if (error.code === 'auth/email-already-in-use') {
                setEmailMessage('This email is already in use by another account.');
            } else if (error.code === 'auth/wrong-password') {
                setEmailMessage('Incorrect current password.');
            } else if (error.code === 'auth/operation-not-allowed') {
                // If verifyBeforeUpdateEmail is not enabled, try with sendEmailVerification
                try {
                    await updateEmail(currentUser, newEmail);
                    await sendEmailVerification(currentUser);
                    setVerificationEmailSent(true);
                    setEmailMessage('Email updated successfully! A verification email has been sent. You MUST check your inbox and click the verification link.');
                    setNewEmail(''); // Clear email input field but keep message visible
                } catch (secondError) {
                    setEmailMessage(`Failed to update email: ${secondError.message || 'Please contact support.'}`);
                }
            } else {
                setEmailMessage(`Failed to update email: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#f2ece4] bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative p-6 md:p-8 bg-[#F8F8F8] rounded-lg shadow-xl max-w-lg mx-auto m-10 border border-gray-200">
                <h3 className="text-2xl font-bold text-[#254159] mb-6 text-center">Account Settings</h3>

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>

                {/* Password Change Section */}
                <div className="mb-8 border-b border-gray-200 pb-6">
                    <h4 className="text-xl font-semibold text-[#254159] mb-4">Change Password</h4>

                    {passwordChangeSuccess ? (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Success Icon */}
                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">Password Updated Successfully</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>Your password has been changed. You can now log in with your new password.</p>
                                        <button
                                            onClick={() => setPasswordChangeSuccess(false)}
                                            className="mt-3 text-sm font-medium text-green-800 hover:text-green-900 underline"
                                        >
                                            Change password again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordChange} className="bg-white p-4 rounded-md shadow-sm">
                            {reauthRequired && (
                                <div className="mb-4">
                                    <label htmlFor="current-password-reauth" className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password (for re-authentication)
                                    </label>
                                    <input
                                        type="password"
                                        id="current-password-reauth"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c] sm:text-sm"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c] sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm-new-password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c] sm:text-sm"
                                    required
                                />
                            </div>
                            {passwordMessage && !passwordChangeSuccess && (
                                <div className={`mt-2 p-2 text-sm rounded-md ${passwordMessage.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {passwordMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#254159] hover:bg-[#f2be5c] hover:text-[#254159] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2be5c]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Email Change Section */}
                <div>
                    <h4 className="text-xl font-semibold text-[#254159] mb-4">Change Email Address</h4>

                    {verificationEmailSent ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Alert Icon */}
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Verification Required</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>A verification email has been sent to your new email address. <strong>You must click the verification link in that email to complete the change.</strong></p>
                                        <p className="mt-1">If you don't see the email in your inbox, please check your spam or junk folder.</p>
                                        <button
                                            onClick={() => setVerificationEmailSent(false)}
                                            className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                                        >
                                            Try another email address
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailChange} className="bg-white p-4 rounded-md shadow-sm">
                            {reauthRequired && (
                                <div className="mb-4">
                                    <label htmlFor="current-password-email-reauth" className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password (for re-authentication)
                                    </label>
                                    <input
                                        type="password"
                                        id="current-password-email-reauth"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c] sm:text-sm"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Email
                                </label>
                                <input
                                    type="email"
                                    id="new-email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c] sm:text-sm"
                                    required
                                />
                            </div>
                            {emailMessage && !verificationEmailSent && (
                                <div className={`mt-2 p-2 text-sm rounded-md ${emailMessage.includes('successfully') || emailMessage.includes('verification') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {emailMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#254159] hover:bg-[#f2be5c] hover:text-[#254159] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2be5c]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : 'Update Email'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer note */}
                <div className="mt-6 text-xs text-gray-500 flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account changes may require you to sign in again on other devices.
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsModal;