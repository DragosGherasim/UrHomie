type StatusCallback = (status: "completed" | "failed", error?: string) => void;

export const listenForRegistrationStatus = (
  correlationId: string,
  onStatus: StatusCallback
) => {
  const ws = new WebSocket(`ws://localhost:80/user-auth/registration-status?correlation_id=${correlationId}`);

  ws.onmessage = ({ data }) => {
    try {
      const { status, error } = JSON.parse(data);

      if (status === "completed") {
        onStatus("completed");
      } else if (status === "failed") {
        onStatus("failed", error);
      } else {
        onStatus("failed", "Unknown status received.");
      }
    } catch {
      onStatus("failed", "Invalid message format.");
    } finally {
      ws.close();
    }
  };

  ws.onerror = () => {
    onStatus("failed", "Connection error");
    ws.close();
  };
};