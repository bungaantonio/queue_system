import { useQueue } from "../hooks/useQueue";
import { QueueActions } from "./QueueActions";

export const QueueList = () => {
    const { queue, called, current, loading, callNext, skip } = useQueue();

    if (loading) return <p>Carregando fila...</p>;

    const canCallNext = !current && (!called || called.length === 0);
    const canSkip = called && called.length > 0;

    return (
        <div>
            <h2>Fila de Atendimento</h2>

            <h4>Em espera</h4>
            <ul>
                {queue.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.status}
                    </li>
                ))}
            </ul>

            {called.length > 0 && (
                <>
                    <h4>Chamados</h4>
                    <ul>
                        {called.map((item) => (
                            <li key={item.id}>
                                {item.name} - {item.status}
                                <QueueActions userId={item.id} status={item.status} />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <button onClick={callNext} disabled={!canCallNext}>
                Chamar Próximo
            </button>
            <button onClick={skip} disabled={!canSkip}>
                Pular
            </button>
        </div>
    );
};
