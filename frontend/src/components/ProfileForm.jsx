import React from "react";

const ProfileForm = ({
  firstName,
  lastName,
  email,
  setFirstName,
  setLastName,
  setEmail,
  handleUpdate,
}) => {
  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label className="block mb-1">First Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Last Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Update Profile
      </button>
    </form>
  );
};

export default ProfileForm;