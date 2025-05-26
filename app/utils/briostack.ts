import { openai } from "@/app/openai";

// Types for service scheduling
export interface AppointmentRegularSchedule {
  useAppointmentPool?: boolean;
  requiresConfirmation?: boolean;
  scheduleType?: "NEVER" | "REGULAR" | "MONTHLY" | "CUSTOM";
  regularScheduleInterval?: number;
  regularScheduleIntervalType?: "DAYS" | "WEEKS" | "MONTHS";
  monthlyScheduleMonths?: number[];
  weeklyScheduleDays?: string[];
  monthlyScheduleDays?: { dayOfTheWeek: string; weekNumber: number }[];
}

export interface ServiceSchedule {
  customSequenceType?: "RANGE" | "SEQUENCE" | "NONE";
  recurrence?: "ONETIME" | "RECURRING";
  schedule?: AppointmentRegularSchedule;
  onHold?: boolean;
  lockAppointment?: boolean;
  arrivalType?: "WINDOW" | "FIXED";
  arriveAfter?: string;
  arriveBefore?: string;
  arriveAt?: string;
}

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
export async function handleBriostackCall({
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

// Convenience wrappers for common Briostack API endpoints
export const listProperties = (query?: Record<string, string>) =>
  handleBriostackCall({ endpoint: "/v1/properties", method: "GET", query });

export const listCustomers = (query?: Record<string, string>) =>
  handleBriostackCall({ endpoint: "/v1/customers", method: "GET", query });

export const getCustomer = (customerId: string) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}`,
    method: "GET",
  });

export const createCustomer = (payload: Record<string, unknown>) =>
  handleBriostackCall({ endpoint: "/v1/customers", method: "POST", payload });

export const updateCustomer = (
  customerId: string,
  payload: Record<string, unknown>
) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}`,
    method: "PUT",
    payload,
  });
// Appointment helpers
export const listAppointments = (
  customerId: string,
  query?: Record<string, string>
) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}/appointments`,
    method: "GET",
    query,
  });

export const getAppointment = (
  customerId: string,
  appointmentId: string
) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}/appointments/${appointmentId}`,
    method: "GET",
  });

export const createAppointment = (
  customerId: string,
  payload: Record<string, unknown>
) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}/appointments`,
    method: "POST",
    payload,
  });

// Service helpers
export const listServices = (
  customerId: string,
  query?: Record<string, string>
) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}/services`,
    method: "GET",
    query,
  });

export const getService = (
  customerId: string,
  serviceId: string
) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}/services/${serviceId}`,
    method: "GET",
  });

export const listAllServices = (query?: Record<string, string>) =>
  handleBriostackCall({ endpoint: "/v1/services", method: "GET", query });

export const createService = (
  customerId: string,
  payload: Record<string, unknown>
) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}/services`,
    method: "POST",
    payload,
  });

export const updateService = (
  customerId: string,
  serviceId: string,
  payload: Record<string, unknown>
) =>
  handleBriostackCall({
    endpoint: `/v1/customers/${customerId}/services/${serviceId}`,
    method: "PATCH",
    payload,
  });

// Webhook helpers
export const listWebhooks = (query?: Record<string, string>) =>
  handleBriostackCall({ endpoint: "/v1/webhooks", method: "GET", query });

export const createWebhook = (payload: Record<string, unknown>) =>
  handleBriostackCall({ endpoint: "/v1/webhooks", method: "POST", payload });

export const getWebhook = (webhookId: string) =>
  handleBriostackCall({
    endpoint: `/v1/webhooks/${webhookId}`,
    method: "GET",
  });

export const updateWebhook = (
  webhookId: string,
  payload: Record<string, unknown>
) =>
  handleBriostackCall({
    endpoint: `/v1/webhooks/${webhookId}`,
    method: "PUT",
    payload,
  });
