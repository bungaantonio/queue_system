// src/dashboard/components/QueueActions.tsx
import { queueDataProvider } from "../data/queueDataProvider";

interface QueueActionsProps {
    userId: number;
    onUpdate?: () => void; // callback para atualizar a fila
}

export const QueueActions = ({ userId, onUpdate }: QueueActionsProps) => {
    const handleFinish = async () => {
        try {
            await queueDataProvider.finish();
            onUpdate?.();
        } catch (err: any) {
            console.error("Erro ao finalizar atendimento:", err.message);
        }
    };

    const handleCancel = async () => {
        try {
            await queueDataProvider.cancel(userId);
            onUpdate?.();
        } catch (err: any) {
            console.error("Erro ao cancelar atendimento:", err.message);
        }
    };

    const handleRequeue = async () => {
        try {
            await queueDataProvider.requeue(userId, "normal", 26);
            onUpdate?.();
        } catch (err: any) {
            console.error("Erro ao reagendar atendimento:", err.message);
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <button onClick={handleFinish}>Finalizar</button>
            <button onClick={handleCancel}>Cancelar</button>
            <button onClick={handleRequeue}>Reagendar</button>
        </div>
    );
};
