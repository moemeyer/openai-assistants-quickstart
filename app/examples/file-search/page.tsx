"use client";
import React from "react";
import styles from "../shared/page.module.css";

import Chat from "../../components/chat";
import FileViewer from "../../components/file-viewer";
import { handleBriostackCall } from "../../utils/briostack";
import { callNextBillionOptimizer } from "../../utils/nextbillion";

const FileSearchPage = () => {
  const functionCallHandler = async (call) => {
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
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          <FileViewer />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FileSearchPage;
