import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({ name: "", age: "", party: "" });
  const [editCandidateId, setEditCandidateId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch candidates when the component loads
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/candidates`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        }
      );
      console.log(response)
      setCandidates(response.data);
    } catch (error) {
      setError("Failed to load candidates");
      console.log(error)
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle candidate creation
  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/candidate`, formData);
      fetchCandidates(); // Refresh the list
      setFormData({ name: "", age: "", party: "" }); // Clear form
      setError("");
      console.log(response)
    } catch (error) {
      setError("Failed to create candidate");
      console.log(error)
    }
  };

  // Handle candidate update
  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/candidate/${editCandidateId}`,
        formData,
        { 
          headers: {
            'Content-Type': 'application/json',  // for JSON data
            Authorization: `Bearer ${localStorage.getItem("token")}`  // for JWT token
          }
         }
      );
      alert(response.data.message)

      fetchCandidates(); // Refresh the list
      setFormData({ name: "", age: "", party: "" });
      setEditCandidateId(null);
      setError("");
    } catch (error) {
      setError("Failed to update candidate");
    }
  };

  // Handle candidate deletion
  const handleDeleteCandidate = async (candidateId) => {
    try {
      const response=await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/candidate/${candidateId}`,
        {
          headers: {
            'Content-Type': 'application/json',  // for JSON data
            Authorization: `Bearer ${localStorage.getItem("token")}`  // for JWT token
          }
        }
      );
      console.log(response)
      fetchCandidates(); // Refresh the list
    } catch (error) {
      setError("Failed to delete candidate");
      console.log(error)
    }
  };

  // Populate form with candidate data for editing
  const handleEditClick = (candidate) => {
    setFormData({
      name: candidate.name,
      age: candidate.age,
      party: candidate.party,
    });
    setEditCandidateId(candidate._id);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Handle navigation to profile page
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Page</h2>
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-medium mb-4">
            {editCandidateId ? "Edit Candidate" : "Add Candidate"}
          </h3>
          {renderForm()}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-medium mb-4">Candidate List</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border text-left">Name</th>
                  <th className="p-2 border text-left">Age</th>
                  <th className="p-2 border text-left">Party</th>
                  <th className="p-2 border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate._id} className="border-b">
                    <td className="p-2">{candidate.name}</td>
                    <td className="p-2">{candidate.age}</td>
                    <td className="p-2">{candidate.party}</td>
                    <td className="p-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEditClick(candidate)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => handleDeleteCandidate(candidate._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the form for creating/updating candidates
  function renderForm() {
    return (
      <form
        onSubmit={editCandidateId ? handleUpdateCandidate : handleCreateCandidate}
        className="space-y-4"
      >
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="age" className="block font-medium mb-1">
            Age:
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="party" className="block font-medium mb-1">
            Party:
          </label>
          <input
            type="text"
            id="party"
            name="party"
            value={formData.party}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editCandidateId ? "Update Candidate" : "Add Candidate"}
        </button>
      </form>
    );
  }
}