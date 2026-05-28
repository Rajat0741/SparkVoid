import { redirect } from "next/navigation";
import { generateId } from "ai";

export default function ChatRootPage() {
  redirect(`/chat/${generateId()}`);
}
