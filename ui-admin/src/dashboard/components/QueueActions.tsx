import { useQueue, UserStatus } from "../hooks/useQueue";

interface Props {
    userId: number;
    status: UserStatus;
}

export const QueueActions = ({ userId, status }: Props) => {
    const { finish, cancel, requeue, skip } = useQueue();

    switch (status) {
        case "BEING_SERVED":
            return (
                <div style={{ marginTop: "0.5rem" }}>
                    <button onClick={() => finish()}>Finalizar</button>
                    <button onClick={() => cancel(userId)}>Cancelar</button>
                    <button onClick={() => requeue(userId, "normal")}>Reagendar</button>
                </div>
            );
        case "CALLED_PENDING":
            return (
                <div style={{ marginTop: "0.5rem" }}>
                    <button onClick={() => skip()}>Pular</button>
                    <button onClick={() => cancel(userId)}>Cancelar</button>
                    <button onClick={() => requeue(userId, "normal")}>Reagendar</button>
                </div>
            );
        default:
            return null;
    }
};
