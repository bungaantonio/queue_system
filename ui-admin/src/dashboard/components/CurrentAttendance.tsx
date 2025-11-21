// src/dashboard/components/CurrentAttendance.tsx
import { useEffect, useState } from "react";
import { queueDataProvider } from "../data/queueDataProvider";

export const CurrentAttendance = () => {
    const [current, setCurrent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const loadCurrent = async () => {
        setLoading(true);
        try {
            const { data } = await queueDataProvider.getCurrent();
            setCurrent(data || null);
        } catch (err: any) {
            console.error("Erro ao carregar atendimento atual:", err.message);
            setCurrent(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCurrent();
        const interval = setInterval(loadCurrent, 5000); // atualiza a cada 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p>Carregando atendimento atual...</p>;

    if (!current)
        return <p>Nenhum usuário está em atendimento no momento.</p>;

    return (
        <div>
            <h2>Atendimento Atual</h2>
            <p>
                {current.name} - {current.status}
            </p>
            <p>Chegada: {new Date(current.timestamp).toLocaleTimeString()}</p>
        </div>
    );
};
