import { listAppointments } from "../app/utils/briostack";

(async () => {
  // Example usage
  process.env.BRIOSTACK_INSTANCE_NAME = "pestproridall";
  process.env.BRIOSTACK_API_KEY = "<YOUR_BRIOSTACK_API_KEY>"; // replace with your key

  const customerId = "<CUSTOMER_ID>"; // replace with a real customer ID
  const appointments = await listAppointments(customerId);
  console.log(appointments);
})();
