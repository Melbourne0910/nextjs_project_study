import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/messages.json");

export async function GET(){
    try {
        const fileData = await fs.readFile(filePath, "utf-8");
        const messages = JSON.parse(fileData);

        return Response.json(messages);
    } catch (error) {
        console.error("Failed to read messages:", error);
        return Response.json(
            { error: "Failed to read messages"},
            {status: 500}
        )
    }
}
export async function POST(request){
    try {
        const newMessage = await request.json();

        if (!newMessage.text?.trim()) {
            return Response.json(
                { error: "Message text is required" },
                { status: 400 }
            );
        }
        
        const fileData = await fs.readFile(filePath, "utf-8");
        const messages = JSON.parse(fileData);

        const message = {
            id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
            text: newMessage.text.trim(),
        };
        messages.push(message);

        await fs.writeFile(filePath, JSON.stringify(messages, null, 2));
        
        return Response.json({
            success: true,
            message: "Message added successfully",
            data: message,
        });
    } catch (error) {
        console.error("Failed to add message:", error);
        return Response.json(
            {error: "Failed to add message"},
            {status: 500}
        );
    }

}
