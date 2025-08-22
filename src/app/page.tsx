"use client";

import { useAppSelector } from "@/store/hooks";
import LoginForm from "@/components/LoginForm";
import KanbanBoard from "@/components/KanbanBoard";

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <KanbanBoard />;
}
