import { useEffect, useState } from "react";
import { subscribeQueueUpdates } from "../utils/api";
import { QueueState, QueueUser } from "../types/queue";

export default function useQueueData() {
  const [currentUser, setCurrentUser] = useState<QueueUser | null>(null);
  const [calledUser, setCalledUser] = useState<QueueUser | null>(null);
  const [nextUsers, setNextUsers] = useState<QueueUser[]>([]);

  useEffect(() => {
    const evtSource = subscribeQueueUpdates((data: QueueState) => {
      setCurrentUser(data.current || null);
      setCalledUser(data.called || null);

      const filteredQueue = data.queue.filter(
        (u) => !(data.called && u.id === data.called.id)
      );

      setNextUsers(filteredQueue.slice(0, 3));
    });

    return () => evtSource.close();
  }, []);

  return { currentUser, calledUser, nextUsers };
}
