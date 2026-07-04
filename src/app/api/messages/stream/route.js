let clients = [];

function encode(str) {
    return new TextEncoder().encode(str);
}

export async function GET(){
    let client;

    const stream = new ReadableStream({
        start(controller) {
            client = controller;
            clients.push(client);

            controller.enqueue(
                encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
            );
        },
        cancel() {
            clients = clients.filter((c) => c !== client);
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}

export function broadcastMessage(message) {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    
    for (const client of clients) {
        try {
            client.enqueue(encode(data));
        } catch (error) {
            console.error("Failed to send message to client:", error);
        }
    }
}
