import type { Participant } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchParticipants(): Promise<Record<string, Participant>> {
  const response = await fetch(`${API_URL}/api/participants`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const result = await response.json();
  const details = await Promise.all(
    result.participants.map(async (item: { id: string }) => {
      const res = await fetch(`${API_URL}/api/participants/${item.id}`);
      if (!res.ok) throw new Error(`Could not load ${item.id}`);
      return res.json() as Promise<Participant>;
    })
  );

  return Object.fromEntries(details.map((person) => [person.id, person]));
}
