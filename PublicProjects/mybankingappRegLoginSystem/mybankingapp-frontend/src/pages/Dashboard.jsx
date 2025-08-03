import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  axios.get("https://mybankingapp-regandlogin-backend.onrender.com/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => setUser(res.data))
  .catch((err) => {
    console.error("Failed to fetch user:", err);
    setUser(null);
  });
}, []);

  return (
    <>
      <p className="text-white text-2xl p-6">
        Success! Your token has been securely stored, and access has been granted. This page is part of one of my fullstack projects.
      </p>
      <p className="text-white text-2xl p-6">
        Access is granted trough a token. For security reasons, the token expires every 24 hours.
      </p>
      <p className="text-white text-2xl p-6">
        Your password is securely hashed and stored in a MongoDB database, so even the site owner cannot see it.
      </p>
      <p className="text-white text-2xl p-6">
        This site is protected against common security threats like NoSQL injection and Cross-Site Scripting.
      </p>
      {user ? (
        <p className="text-white text-2xl p-6">
          You are logged in as <span className="font-bold">{user.email}</span>.
        </p>
      ) : (
        <p className="text-white text-2xl p-6">
          Loading user data from the database...
        </p>
      )}
    </>
  );
}

export default Dashboard;
