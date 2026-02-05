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

  const handleDelete = async (id) => {
    console.log(id);
    console.log("Token:", token);
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
