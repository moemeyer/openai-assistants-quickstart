"use client";

import { useState, useEffect } from "react";

const BriostackConnect = () => {
  const [instance, setInstance] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInstance(localStorage.getItem("briostackInstanceName") || "");
      setApiKey(localStorage.getItem("briostackApiKey") || "");
    }
  }, []);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("briostackInstanceName", instance);
      localStorage.setItem("briostackApiKey", apiKey);
      alert("Briostack settings saved");
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Connect to Briostack</h1>
      <form onSubmit={saveSettings} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
        <label>
          Instance Name
          <input
            type="text"
            value={instance}
            onChange={(e) => setInstance(e.target.value)}
            placeholder="your-instance"
            required
          />
        </label>
        <label>
          API Key
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </main>
  );
};

export default BriostackConnect;

