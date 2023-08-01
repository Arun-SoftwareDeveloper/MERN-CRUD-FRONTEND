import React, { useState, useEffect } from "react";
import UserTable from "./tables/UserTable";
import AddUserForm from "./forms/AddUserForm";
import EditUserForm from "./forms/EditUserForm";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    roll: null,
    name: "",
    class: "",
  });

  const addUser = (user) => {
    user.roll = users.length > 0 ? users[users.length - 1].roll + 1 : 1;
    setUsers([...users, user]);
  };

  const deleteUser = async (roll) => {
    try {
      await axios.delete(`http://localhost:4000/students/${roll}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.roll !== roll));

      // Update roll numbers of remaining users after deletion
      setUsers((prevUsers) =>
        prevUsers.map((user, index) => ({ ...user, roll: index + 1 }))
      );

      // Batch update the data after deletion
      try {
        await axios.put("http://localhost:4000/students", users);

        // If the backend successfully updates the data, we can assume the roll numbers are now in sync.
        // You can choose to display a success message if needed.
        console.log("Data updated successfully!");
      } catch (error) {
        // If there's an error in the backend update, revert the frontend change to avoid inconsistencies.
        console.error("Error updating users:", error);
        // Refetch the data from the server to reset the frontend state to match the backend state.
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const editUser = (roll, user) => {
    setEditing(true);
    setCurrentUser(user);
  };

  const updateUser = async (newUser) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/students/${newUser.roll}`,
        newUser
      );
      if (response.status >= 200 && response.status < 300) {
        setUsers(
          users.map((user) => (user.roll === newUser.roll ? newUser : user))
        );
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setEditing(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/students");
      if (response.status >= 200 && response.status < 300) {
        setUsers(response.data);
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1>MERN CRUD App</h1>
      <div className="row">
        <div className="five columns">
          {editing ? (
            <div>
              <h2>Edit user</h2>
              <EditUserForm
                currentUser={currentUser}
                setEditing={setEditing}
                updateUser={updateUser}
              />
            </div>
          ) : (
            <div>
              <h2>Add user</h2>
              <AddUserForm addUser={addUser} />
            </div>
          )}
        </div>
        <div className="seven columns">
          <h2>View users</h2>
          <UserTable
            users={users}
            deleteUser={deleteUser}
            editUser={editUser}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
