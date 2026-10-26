// RTK Query base query for the dummy backend. Enabled unless VITE_USE_MOCK_API=false.
// The catalogue and request handlers are fetched on first use, keeping them out of the
// initial JavaScript download.
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

let server;

const mockBaseQuery = async (args) => {
  server ??= import("./mockServer").then((m) => m.default);
  const handleRequest = await server;
  return handleRequest(args);
};

export default mockBaseQuery;
