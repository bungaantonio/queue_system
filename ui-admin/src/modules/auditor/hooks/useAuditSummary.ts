import { useEffect, useState } from "react";
import { auditorGateway } from "../auditorGateway";
import type { AuditChainSummary } from "../types";

export const useGetHeader = () => {
  const [summary, setSummary] = useState<AuditChainSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;

    auditorGateway
      .getSummary()
      .then((result) => {
        if (mounted) setSummary(result);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { summary, loading, error };
};
