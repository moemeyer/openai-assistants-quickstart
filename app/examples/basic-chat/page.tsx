"use client";

import React from "react";
import styles from "./page.module.css"; // use simple styles for demonstration purposes
import Chat from "../../components/chat";
import { handleBriostackCall } from "../../utils/briostack";

const Home = () => {
  const functionCallHandler = async (call) => {
    if (call?.function?.name === "call_briostack") {
      const args = JSON.parse(call.function.arguments);
      const result = await handleBriostackCall(args);
      return JSON.stringify(result);
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
