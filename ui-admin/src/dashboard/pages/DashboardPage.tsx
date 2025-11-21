// src/dashboard/DashboardPage.tsx
import { useState } from "react";
import { QueueList } from "../components/QueueList";
import { CurrentAttendance } from "../components/CurrentAttendance";
import { QueueActions } from "../components/QueueActions";

export const DashboardPage = () => {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    return (
        <div style={{ padding: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {/* Fila de espera */}
            <div style={{ flex: 1, minWidth: "300px" }}>
                <QueueList />
            </div>

            {/* Atendimento atual */}
            <div style={{ flex: 1, minWidth: "300px" }}>
                <CurrentAttendance />
            </div>

            {/* Painel de ações */}
            {selectedUserId && (
                <div style={{ flex: 1, minWidth: "300px" }}>
                    <h2>Ações do Usuário Selecionado</h2>
                    <QueueActions
                        userId={selectedUserId}
                        onUpdate={() => setSelectedUserId(null)} // limpa seleção após ação
                    />
                </div>
            )}
        </div>
    );
};
