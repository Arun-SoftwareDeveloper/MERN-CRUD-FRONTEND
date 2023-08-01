import React, { useState } from "react";
import axios from "axios";

const EditUserForm = (props) => {
  const [user, setUser] = useState(props.currentUser);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/students/${user.roll}`,
        user
      );
      if (response.status >= 200 && response.status < 300) {
        // PUT request was successful
        props.updateUser(user);
      } else if (!user.name || !user.class) {
        setErrorMessage("Please fill in both Name and Class fields.");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Something went wrong with the PUT request:", error);
      setErrorMessage("Something went wrong with the PUT request.");
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
        Edit user
      </button>
      <button type="button" onClick={() => props.setEditing(false)}>
        Cancel
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default EditUserForm;
