import { useQueue } from "../hooks/useQueue";

export const QueueList = () => {
    const { queue, loading, callNext, skip } = useQueue();

    if (loading) return <p>Carregando fila...</p>;

    return (
        <div>
            <h2>Fila de Atendimento</h2>
            <ul>
                {queue.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.status}
                    </li>
                ))}
            </ul>
            <button onClick={callNext}>Chamar Próximo</button>
            <button onClick={skip}>Pular</button>
        </div>
    );
};
