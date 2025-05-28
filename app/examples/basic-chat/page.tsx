"use client";

import React from "react";
import styles from "./page.module.css"; // use simple styles for demonstration purposes
import Chat from "../../components/chat";
import { handleBriostackCall } from "../../utils/briostack";
import { callNextBillionOptimizer } from "../../utils/nextbillion";

const Home = () => {
  const functionCallHandler = async (call) => {
    try {
      if (call?.function?.name === "call_briostack") {
        const args = JSON.parse(call.function.arguments);
        const result = await handleBriostackCall(args);
        return JSON.stringify(result);
      }
      if (call?.function?.name === "optimize_routes") {
        const args = JSON.parse(call.function.arguments);
        const result = await callNextBillionOptimizer(args);
        return JSON.stringify(result);
      }
    } catch (err) {
      console.error(err);
      return JSON.stringify({ error: "Failed to handle function call" });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Chat functionCallHandler={functionCallHandler} />
      </div>
    </main>
  );
};

export default Home;
