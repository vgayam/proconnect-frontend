"use client";

import { useSearchParams } from "next/navigation";
import { ListServiceForm } from "./ListServiceForm";

export function ListServiceFormWrapper() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  return <ListServiceForm isEdit={isEdit} />;
}
