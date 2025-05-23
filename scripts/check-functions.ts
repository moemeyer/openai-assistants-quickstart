import OpenAI from "openai";

const openai = new OpenAI();

async function checkFunctions() {
  const assistantId = process.env.OPENAI_ASSISTANT_ID || "asst_1hDEC0VYhrcW3CbAk9rB7sa1";
  const assistant = await openai.assistants.retrieve(assistantId);
  console.log("Registered functions:", assistant.functions);
}

checkFunctions().catch((err) => {
  console.error(err);
  process.exit(1);
});
