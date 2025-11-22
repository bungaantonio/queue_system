import { useQueue } from "../hooks/useQueue";

export const CurrentAttendance = () => {
    const { current, loading } = useQueue();

    if (loading) return <p>Carregando atendimento atual...</p>;
    if (!current) return <p>Nenhum usuário está em atendimento.</p>;

    return (
        <div>
            <h2>Atendimento Atual</h2>
            <p>{current.name} - {current.status}</p>
            <p>Chegada: {new Date(current.timestamp).toLocaleTimeString()}</p>
        </div>
    );
};
