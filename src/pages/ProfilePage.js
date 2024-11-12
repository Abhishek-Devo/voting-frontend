import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const navigate = useNavigate();

    // Fetch user data when the component loads
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });
                setUser(response.data);
            } catch (error) {
                setError("Failed to load profile");
            }
        };
        fetchUser();
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login page
    };

    // Handle change password form submission
    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
         await axios.put(
                `${process.env.REACT_APP_API_URL}/users/profile/password`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setPasswordSuccess("Password changed successfully");
            setPasswordError("");
            setOldPassword("");
            setNewPassword("");
            setShowChangePassword(false);
        } catch (error) {
            setPasswordError("Failed to change password");
            setPasswordSuccess("");
        }
    };

    // Redirect to voting page if user has not voted
    const handleVotingPage = () => {
        if (!user.isVoted) {
            navigate("/voting");
        }
    };

    // Navigate to admin page if user is an admin
    const handleAdminPage = () => {
        if (user.role === 'admin') {
            navigate("/admin");
        }
    };


    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
            {error && <p className="text-red-500">{error}</p>}
            {user ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="mb-2"><span className="font-medium">Name:</span> {user.name}</p>
                    <p className="mb-2"><span className="font-medium">Age:</span> {user.age}</p>
                    <p className="mb-2"><span className="font-medium">Address:</span> {user.address}</p>
                    <p className="mb-2"><span className="font-medium">Role:</span> {user.role}</p>
                    <p className="mb-2"><span className="font-medium">Voting status:</span> {user.isVoted ? "Voted" : "Not voted"}</p>

                    <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-4">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            {!user.isVoted && (
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={handleVotingPage}
                                >
                                    Go to Voting
                                </button>
                            )}
                       </div>
                        {user.role === 'admin' && (
                            <button
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                                onClick={handleAdminPage}
                            >
                                Go to Admin
                            </button>
                        )}
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            onClick={() => setShowChangePassword(!showChangePassword)}
                        >
                            {showChangePassword ? "Cancel" : "Change Password"}
                        </button>
                    </div>

                    {showChangePassword && (
                        <form onSubmit={handleChangePassword} className="mt-4">
                            <div className="mb-4">
                                <label htmlFor="oldPassword" className="block font-medium mb-1">
                                    Old Password:
                                </label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block font-medium mb-1">
                                    New Password:
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Change Password
                            </button>
                        </form>
                    )}

                    {passwordError && <p className="text-red-500 mt-4">{passwordError}</p>}
                    {passwordSuccess && <p className="text-green-500 mt-4">{passwordSuccess}</p>}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}