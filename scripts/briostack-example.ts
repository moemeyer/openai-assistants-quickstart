import { chatWithBriostack } from "../app/utils/briostack";

(async () => {
  // Example usage
  process.env.BRIOSTACK_INSTANCE_NAME = "pestproridall";
  process.env.BRIOSTACK_API_KEY = "<YOUR_BRIOSTACK_API_KEY>"; // replace with your key
  const reply = await chatWithBriostack("List all my properties from Briostack");
  console.log(reply);
})();
