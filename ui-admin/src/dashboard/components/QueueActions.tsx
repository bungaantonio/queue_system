import { useQueue } from "../hooks/useQueue";

interface Props {
    userId: number;
}

export const QueueActions = ({ userId }: Props) => {
    const { finish, cancel, requeue } = useQueue();

    return (
        <div style={{ marginTop: "1rem" }}>
            <button onClick={() => finish()}>Finalizar</button>
            <button onClick={() => cancel(userId)}>Cancelar</button>
            <button onClick={() => requeue(userId, "normal", 26)}>Reagendar</button>
        </div>
    );
};
