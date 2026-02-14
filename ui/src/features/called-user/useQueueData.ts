// features/called-user/useQueueData.ts
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

export default function useQueueData() {
  const { currentUser, calledUser, nextUsers, timer } = useQueueStream();
  return { currentUser, calledUser, nextUsers, timer };
}
