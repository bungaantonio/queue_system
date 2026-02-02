import { useState, useEffect } from "react";
import { OperatorsContext } from "./OperatorsContext";
import { operatorsDataProvider } from "./operatorsDataProvider";
import type { Operator } from "./types";

export const OperatorsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<Record<number, boolean>>(
    {},
  );

  const setUserLoading = (id: number, value: boolean) => {
    setLoadingActions((prev) => ({ ...prev, [id]: value }));
  };

  const reload = async () => {
    setLoading(true);
    try {
      const { data } = await operatorsDataProvider.getList();
      setOperators(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const create = async (operator: Omit<Operator, "id">) => {
    setLoading(true);
    try {
      await operatorsDataProvider.create(operator);
      await reload();
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, operator: Partial<Operator>) => {
    setUserLoading(id, true);
    try {
      await operatorsDataProvider.update(id, operator);
      await reload();
    } finally {
      setUserLoading(id, false);
    }
  };

  const remove = async (id: number) => {
    setUserLoading(id, true);
    try {
      await operatorsDataProvider.delete(id);
      await reload();
    } finally {
      setUserLoading(id, false);
    }
  };

  return (
    <OperatorsContext.Provider
      value={{
        operators,
        loading,
        loadingActions,
        create,
        update,
        delete: remove,
        reload,
      }}
    >
      {children}
    </OperatorsContext.Provider>
  );
};
