import React, { useState, useEffect } from "react";
import axios from "axios";

const UserTable = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/students");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Roll</th>
          <th>Name</th>
          <th>Class</th>
          {/* <th>Actions</th> */}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((user) => {
            const { roll, name, class: userClass } = user; // Use 'class' as 'userClass'
            return (
              <tr key={roll}>
                <td>{roll}</td>
                <td>{name}</td>
                <td>{userClass}</td>
                <td>
                  <button onClick={() => props.deleteUser(roll)}>Delete</button>
                  <button onClick={() => props.editUser(roll, user)}>
                    Edit
                  </button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4}>No users found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
