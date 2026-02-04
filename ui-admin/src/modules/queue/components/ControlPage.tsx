import { useEffect, useState } from "react";
import { List, Datagrid, TextField } from "react-admin";
import { atendimentoGateway } from "../atendimentoGateway";

export const ControlPage = () => {
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    const fetchQueue = async () => {
      const response = await atendimentoGateway.getList();
      setQueue(response.data);
    };
    fetchQueue();
  }, []);

  return (
    <List title="Painel de Atendimento" resource="atendimento" exporter={false}>
      <Datagrid>
        <TextField source="id" label="ID" />
        <TextField source="name" label="Utente" />
        <TextField source="status" label="Status" />
      </Datagrid>
    </List>
  );
};
