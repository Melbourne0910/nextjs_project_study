import ChatPage from "./ChatPage";
import { courses } from "@/data/courses";

export const metadata = {
  title: "Chat | Agora",
  description: "Join the conversation and chat in real time on Agora.",
};

export default function Page() {
  return <ChatPage course={courses[0]} />;
}
