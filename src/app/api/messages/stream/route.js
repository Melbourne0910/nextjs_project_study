export const dynamic = "force-dynamic";

const clients = globalThis.__messageClients ?? new Set();
globalThis.__messageClients = clients;
const encoder = new TextEncoder();

function encode(value) {
  return encoder.encode(value);
}

export async function GET() {
  let client;

  const stream = new ReadableStream({
    start(controller) {
      client = controller;
      clients.add(client);

      controller.enqueue(
        encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
      );
    },
    cancel() {
      clients.delete(client);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export function broadcastMessage(payload) {
  if (!payload?.type) {
    console.error("Payload must include a type");
    return;
  }

  const data = `data: ${JSON.stringify(payload)}\n\n`;

  for (const client of clients) {
    try {
      client.enqueue(encode(data));
    } catch (error) {
      console.error("Failed to send message to client:", error);
      clients.delete(client);
    }
  }
}
