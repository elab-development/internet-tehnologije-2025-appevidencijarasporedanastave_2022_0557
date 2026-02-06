import { useEffect, useState } from "react";
import axios from "axios";
import ProfileForm from "./ProfileForm";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    role: "STUDENT",
    studyYear: "",
    idGroup: "",
    studentIndex: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleCreateChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...newUser };

      if (payload.role === "STUDENT") {
        payload.studyYear = Number(payload.studyYear);
        payload.idGroup = Number(payload.idGroup);
      } else {
        delete payload.studyYear;
        delete payload.idGroup;
        delete payload.studentIndex;
      }

      const res = await axios.post("http://localhost:3000/api/users", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers([...users, res.data.data]);
      setShowCreateForm(false);

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        role: "STUDENT",
        studyYear: "",
        idGroup: "",
        studentIndex: "",
      });

      alert("User created successfully");
    } catch (err) {
      console.error("Error creating user", err);
      alert("Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user", err);
      alert("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${editingUser.id}`,
        { firstName, lastName, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map((u) => (u.id === editingUser.id ? res.data.data : u)));

      alert("User updated successfully");
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user", err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 w-1/2 mx-auto">
        <h1 className="text-2xl font-bold">Users</h1>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {showCreateForm && (
        <div className="max-w-md mx-auto mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Create User</h2>

          <form onSubmit={handleCreateUser} className="space-y-3">
            <input
              name="firstName"
              placeholder="First name"
              value={newUser.firstName}
              onChange={handleCreateChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="lastName"
              placeholder="Last name"
              value={newUser.lastName}
              onChange={handleCreateChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleCreateChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="username"
              placeholder="Username"
              value={newUser.username}
              onChange={handleCreateChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleCreateChange}
              className="w-full border p-2 rounded"
              required
            />

            <select
              name="role"
              value={newUser.role}
              onChange={handleCreateChange}
              className="w-full border p-2 rounded"
            >
              <option value="STUDENT">Student</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ADMIN">Admin</option>
            </select>

            {/* Polja samo za STUDENT */}
            {newUser.role === "STUDENT" && (
              <>
                <input
                  name="studyYear"
                  placeholder="Study Year"
                  type="number"
                  value={newUser.studyYear}
                  onChange={handleCreateChange}
                  className="w-full border p-2 rounded"
                  required
                />

                <input
                  name="idGroup"
                  placeholder="Group"
                  type="number"
                  value={newUser.idGroup}
                  onChange={handleCreateChange}
                  className="w-full border p-2 rounded"
                  required
                />

                <input
                  name="studentIndex"
                  placeholder="Student Index"
                  value={newUser.studentIndex}
                  onChange={handleCreateChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </>
            )}

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create
              </button>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {editingUser && (
        <div className="max-w-md mx-auto mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          <ProfileForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setEmail={setEmail}
            handleUpdate={handleUpdate}
          />
          <button
            className="mt-2 text-gray-600"
            onClick={() => setEditingUser(null)}
          >
            Cancel
          </button>
        </div>
      )}

      <table className="w-1/2 mx-auto border text-center text-xl">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td>
                {u.firstName} {u.lastName}
              </td>
              <td>{u.role}</td>
              <td className="flex gap-2 justify-center">
                <Link to={`/schedule/${u.id}`} className="text-blue-600">
                  Schedule
                </Link>
                <button
                  className="text-yellow-600 ml-2"
                  onClick={() => handleEdit(u)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 ml-2"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
