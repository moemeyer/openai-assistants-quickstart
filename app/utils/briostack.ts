import { openai } from "@/app/openai";

// Briostack function schema for OpenAI function calling
const brioFunction = {
  name: "call_briostack",
  description: "Executes a request against the Briostack API for Pest Pro Rid All",
  parameters: {
    type: "object",
    properties: {
      endpoint: {
        type: "string",
        description: "The Briostack endpoint path, e.g. '/v1/properties'"
      },
      method: {
        type: "string",
        enum: ["GET", "POST", "PUT", "DELETE"],
        description: "HTTP method"
      },
      payload: {
        type: "object",
        description: "JSON body for POST/PUT requests"
      },
      query: {
        type: "object",
        description: "Query params as key/value pairs"
      }
    },
    required: ["endpoint", "method"],
    additionalProperties: false
  }
};

// Call the Briostack API
async function handleBriostackCall({
  endpoint,
  method,
  payload,
  query,
}: {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  payload?: Record<string, unknown>;
  query?: Record<string, string>;
}) {
  const baseUrl = `https://${process.env.BRIOSTACK_INSTANCE_NAME}.briostack.com/api`;
  const url = new URL(baseUrl + endpoint);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.BRIOSTACK_API_KEY || "",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Briostack ${method} ${endpoint} failed ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function chatWithBriostack(userPrompt: string) {
  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: userPrompt }],
    functions: [brioFunction],
    function_call: "auto",
  });

  const choice = chat.choices[0];
  if (
    choice.finish_reason === "function_call" &&
    choice.message.function_call?.name === "call_briostack"
  ) {
    const args = JSON.parse(choice.message.function_call.arguments || "{}");
    const result = await handleBriostackCall(args);
    const followUp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        choice.message,
        { role: "function", name: "call_briostack", content: JSON.stringify(result) },
      ],
    });
    return followUp.choices[0].message.content;
  }
  return choice.message.content;
}
