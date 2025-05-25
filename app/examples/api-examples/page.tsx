"use client";

import React from "react";
import styles from "../basic-chat/page.module.css";
import Chat from "../../components/chat";
import { handleBriostackCall } from "../../utils/briostack";

const ApiExamples = () => {
  const functionCallHandler = async (call: any) => {
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

export default ApiExamples;
