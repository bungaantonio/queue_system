import { CurrentAttendance } from "../components/CurrentAttendance";
import { QueueList } from "../components/QueueList";

export const DashboardPage = () => {
    return (
        <div style={{ padding: "1rem" }}>
            <h1>Painel de Atendimento</h1>

            {/* Atendimento atual */}
            <CurrentAttendance />

            {/* Lista da fila com botões globais */}
            <QueueList />
        </div>
    );
};
