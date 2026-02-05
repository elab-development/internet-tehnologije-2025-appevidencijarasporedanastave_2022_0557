import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileForm from "./ProfileForm";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.data);
        setFirstName(res.data.data.firstName);
        setLastName(res.data.data.lastName);
        setEmail(res.data.data.email);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3000/api/users/me`,
        { firstName, lastName, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.data);
      alert("Profile updated successfully");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error updating profile");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (errorMsg) return <div className="p-8 text-red-500">{errorMsg}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <ProfileForm
        firstName={firstName}
        lastName={lastName}
        email={email}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default Profile;