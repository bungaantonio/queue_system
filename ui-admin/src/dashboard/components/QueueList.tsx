// src/dashboard/components/QueueList.tsx
import { useQueue } from "../hooks/useQueue";
import { QueueActions } from "./QueueActions";

export const QueueList = () => {
    const { queue, called, loading, callNext, skip } = useQueue();

    if (loading) return <p>Carregando fila...</p>;

    return (
        <div>
            <h2>Fila de Atendimento</h2>

            {/* Lista de usuários aguardando */}
            <h4>Em espera</h4>
            <ul>
                {queue.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.status}
                    </li>
                ))}
            </ul>

            {/* Lista de chamados com ações */}
            {called && called.length > 0 && (
                <>
                    <h4>Chamados</h4>
                    <ul>
                        {called.map((item) => (
                            <li key={item.id}>
                                {item.name} - {item.status}
                                <QueueActions userId={item.id} />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <button onClick={callNext}>Chamar Próximo</button>
            <button onClick={skip}>Pular</button>
        </div>
    );
};
