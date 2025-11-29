export interface MisinfoPayload {
  text: string;
  userId?: string;
  platform?: "web" | "telegram" | "whatsapp";
}

export async function sendToBackend(payload: MisinfoPayload) {
  try {
    const response = await fetch("http://localhost:8000/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error hitting backend:", err);
    return null;
  }
}
