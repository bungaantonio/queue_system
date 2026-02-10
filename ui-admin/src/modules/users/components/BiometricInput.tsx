import { useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { biometricService } from "../../../services/biometricService";
import { useInput } from "react-admin";

export const BiometricInput = ({
  source,
  operatorId,
}: {
  source: string;
  operatorId: number;
}) => {
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
      const { session_id } = await biometricService.requestCapture(operatorId);

      // Polling
      const interval = setInterval(async () => {
        const hash = await biometricService.fetchHash(session_id);
        if (hash) {
          onChange(hash); // Atualiza o valor no formulário do React-Admin
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
    } catch (e) {
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
