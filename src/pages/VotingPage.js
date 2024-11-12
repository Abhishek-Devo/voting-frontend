import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  // Fetching candidates when the component loads
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URl}/candidates`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });
        setCandidates(response.data); // Storing candidate data in state
      } catch (error) {
        setError("Failed to load candidates");
      }
    };
    fetchCandidates();
  }, []);

  // Handling voting for a candidate
  const handleVote = async (candidateId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URl}/candidates/${candidateId}/vote`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });

      // Show success message
      setSuccessMessage(response.data.message);
      // Clear error message
      setError("");

      // Update the vote count for the voted candidate
      setCandidates(candidates.map(candidate =>
        candidate._id === candidateId
          ? { ...candidate, voteCount: candidate.voteCount + 1 }
          : candidate
      ));

      // Clear the success message after a few seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError("Failed to cast vote");
      setSuccessMessage(""); // Clear success message if there was an error
    }
  }

  // Handle sorting candidates
  const handleSort = () => {
    const sortedCandidates = [...candidates].sort((a, b) =>
      sortDirection === "asc"
        ? a.voteCount - b.voteCount
        : b.voteCount - a.voteCount
    );
    setCandidates(sortedCandidates);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle navigation to profile page
  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Handle refreshing candidate data
  const handleRefresh = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URl}/candidates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });
      setCandidates(response.data);
      setError("");
    } catch (error) {
      setError("Failed to refresh candidate data");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Voting Page</h2>
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleRefresh}
          >
            Refresh
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleSort}
          >
            {sortDirection === "asc" ? "Sort Asc" : "Sort Desc"}
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleProfileClick}
          >
            Profile
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {candidates.map((candidate, index) => (
          <div key={candidate._id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-medium mb-2">{candidate.name}</h3>
            <p className="mb-2"><span className="font-medium">Party:</span> {candidate.party}</p>
            <p className="mb-2"><span className="font-medium">Age:</span> {candidate.age}</p>
            <p className="mb-4"><span className="font-medium">Votes:</span> {candidate.voteCount}</p>
            <button
              onClick={() => handleVote(candidate._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}