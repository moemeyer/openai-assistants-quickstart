import { getService } from "../app/utils/briostack";

(async () => {
  process.env.BRIOSTACK_INSTANCE_NAME = "pestproridall";
  process.env.BRIOSTACK_API_KEY = "<YOUR_BRIOSTACK_API_KEY>";

  const customerId = "<CUSTOMER_ID>";
  const serviceId = "<SERVICE_ID>";
  const service = await getService(customerId, serviceId);
  console.log(service.serviceSchedule);
})();
