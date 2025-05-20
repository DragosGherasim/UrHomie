type StatusCallback = (status: "completed" | "failed", error?: string) => void;

export const listenForRegistrationStatus = (
  correlationId: string,
  onStatus: StatusCallback
) => {
  const ws = new WebSocket(`ws://localhost:80/user-auth/registration-status?correlation_id=${correlationId}`);

  ws.onmessage = (event) => {
    const saga = JSON.parse(event.data);
    if (saga.status === "completed") {
      onStatus("completed");
    } else if (saga.status === "failed") {
      onStatus("failed", saga.error);
    }
    ws.close();
  };

  ws.onerror = () => onStatus("failed", "Connection error");
};
