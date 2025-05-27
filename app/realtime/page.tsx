"use client";
import { useState } from "react";

export default function RealtimeDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  async function startWebRTC() {
    const res = await fetch("/api/realtime/session", { method: "POST", body: JSON.stringify({})});
    const data = await res.json();
    const token = data.client_secret.value;

    const connection = new RTCPeerConnection();
    setPc(connection);

    connection.ontrack = (e) => {
      const audioEl = document.getElementById("remote-audio") as HTMLAudioElement;
      audioEl.srcObject = e.streams[0];
    };

    const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
    connection.addTrack(ms.getTracks()[0]);

    const dc = connection.createDataChannel("oai-events");
    dc.addEventListener("message", (e) => {
      setLog((prev) => [...prev, e.data]);
    });

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);

    const res2 = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/sdp",
      },
    });
    const answer = { type: "answer", sdp: await res2.text() };
    await connection.setRemoteDescription(answer);
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Realtime API Demo</h1>
      <p>This demo uses WebRTC to connect to the OpenAI Realtime API.</p>
      <button onClick={startWebRTC}>Start Session</button>
      <audio id="remote-audio" autoPlay />
      <pre>{log.join("\n")}</pre>
    </main>
  );
}
