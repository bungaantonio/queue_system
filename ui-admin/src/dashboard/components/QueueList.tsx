// src/dashboard/components/QueueList.tsx
import { useEffect, useState } from "react";
import { queueDataProvider } from "../data/queueDataProvider";

export const QueueList = () => {
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadQueue = async () => {
        setLoading(true);
        try {
            const { data } = await queueDataProvider.listWaitingAndCalled();
            setQueue(data);
        } catch (err: any) {
            console.error("Erro ao carregar fila:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueue();
    }, []);

    return (
        <div>
            <h2>Fila de Atendimento</h2>
            {loading ? <p>Carregando...</p> : (
                <ul>
                    {queue.map((item) => (
                        <li key={item.user_id}>{item.user_name} - {item.status}</li>
                    ))}
                </ul>
            )}
            <button onClick={() => queueDataProvider.callNext().then(loadQueue)}>Chamar Próximo</button>
            <button onClick={() => queueDataProvider.skip().then(loadQueue)}>Pular</button>
        </div>
    );
};
