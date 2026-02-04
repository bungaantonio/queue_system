import React, { useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useInput } from "react-admin";
import { biometricGateway } from "../../../services/biometricGateway";

interface BiometricInputProps {
  source: string;
  operatorId: number;
}

export const BiometricInput = ({ source, operatorId }: BiometricInputProps) => {
  const {
    field: { onChange, value },
  } = useInput({ source });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "waiting" | "success" | "error"
  >("idle");

  const handleCapture = async () => {
    setLoading(true);
    setStatus("waiting");

    try {
      const { session_id } = await biometricGateway.requestCapture(operatorId);

      // Polling a cada 2 segundos
      const interval = setInterval(async () => {
        const hash = await biometricGateway.fetchHash(session_id);
        if (hash) {
          onChange(hash); // atualiza o valor no formulário do React Admin
          setStatus("success");
          setLoading(false);
          clearInterval(interval);
        }
      }, 2000);

      // Timeout de 1 minuto
      setTimeout(() => {
        clearInterval(interval);
        if (status === "waiting") setStatus("error");
      }, 60000);
    } catch (err) {
      setStatus("error");
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "1em" }}>
      <Button
        variant="contained"
        color={status === "success" ? "success" : "primary"}
        onClick={handleCapture}
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} /> : <FingerprintIcon />
        }
      >
        {status === "success" ? "Digital Vinculada" : "Capturar Biometria"}
      </Button>

      {value && (
        <Typography variant="caption" display="block">
          Hash: {value.substring(0, 10)}...
        </Typography>
      )}
    </div>
  );
};
