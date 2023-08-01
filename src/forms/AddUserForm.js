import React, { useState, useEffect } from "react";
import axios from "axios";

const AddUserForm = (props) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: "", class: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
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

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.class) {
      setErrorMessage("Please fill in both Name and Class fields.");
      return;
    }

    const maxRoll = users.reduce(
      (max, user) => (user.roll > max ? user.roll : max),
      0
    );
    const newRoll = maxRoll + 1;
    const newUser = { ...user, roll: newRoll };

    try {
      const response = await axios.post(
        "http://localhost:4000/addStudents",
        newUser
      );

      if (response.status >= 200 && response.status < 300) {
        props.addUser(newUser);
        setUser({ name: "", class: "" });
        setErrorMessage("");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Something went wrong with the POST request:", error);
      setErrorMessage("Something went wrong with the POST request.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        className="u-full-width"
        type="text"
        value={user.name}
        name="name"
        onChange={handleChange}
      />
      <label>Class</label>
      <input
        className="u-full-width"
        type="text"
        value={user.class}
        name="class"
        onChange={handleChange}
      />
      <button className="button-primary" type="submit">
        Add user
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default AddUserForm;
