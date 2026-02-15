// kpiData.tsx
import { Kpi } from "./types";
import {
  Users,
  Phone,
  UserCheck,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export const kpiData: Kpi[] = [
  {
    title: "Utilizadores à espera",
    value: 12,
    subtitle: "na fila",
    icon: <Users size={24} />,
    color: "warning",
    trend: { value: 8, isPositive: false },
  },
  {
    title: "Utilizadores chamados",
    value: 3,
    subtitle: "resposta pendente",
    icon: <Phone size={24} />,
    color: "info",
    trend: { value: 25, isPositive: true },
  },
  {
    title: "A ser atendido",
    value: 1,
    subtitle: "sessões ativas",
    icon: <UserCheck size={24} />,
    color: "success",
    trend: { value: 5, isPositive: true },
  },
  {
    title: "Tempo médio de espera",
    value: "8,5 min",
    subtitle: "média de hoje",
    icon: <Clock size={24} />,
    color: "primary",
    trend: { value: 12, isPositive: false },
  },
  {
    title: "Atendimentos concluídos hoje",
    value: 156,
    subtitle: "sessões atendidas",
    icon: <CheckCircle size={24} />,
    color: "success",
    trend: { value: 18, isPositive: true },
  },
  {
    title: "Cumprimento de SLA",
    value: "94,2%",
    subtitle: "acordo de nível de serviço",
    icon: <TrendingUp size={24} />,
    color: "success",
    trend: { value: 3.1, isPositive: true },
  },
];
