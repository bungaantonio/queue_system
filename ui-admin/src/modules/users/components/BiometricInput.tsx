// src/modules/users/components/BiometricInput.tsx
import { useState } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Stack,
  alpha,
  Avatar,
} from "@mui/material";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { biometricService } from "../../../services/biometricService";
import { useInput } from "react-admin";

type HttpLikeError = { status?: number };

const hasStatus = (err: unknown): err is HttpLikeError =>
  typeof err === "object" && err !== null && "status" in err;

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

      const interval = setInterval(async () => {
        try {
          const hash = await biometricService.fetchHash(session_id);
          if (hash) {
            onChange(hash);
            setStatus("success");
            setLoading(false);
            clearInterval(interval);
          }
        } catch (err: unknown) {
          if (!hasStatus(err) || err.status !== 404) throw err;
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(interval);
        if (loading) setStatus("error");
      }, 60000);
    } catch {
      setStatus("error");
      setLoading(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: status === "success" ? alpha("#10B981", 0.05) : "grey.50",
        border: "2px dashed",
        borderColor: status === "success" ? "success.main" : "divider",
        mb: 3,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: status === "success" ? "success.main" : "primary.main",
            width: 56,
            height: 56,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <FingerprintIcon fontSize="large" />
          )}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" fontWeight="700">
            Identificação Biométrica
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {status === "success"
              ? "Digital capturada com sucesso"
              : "Aguardando captura da impressão digital"}
          </Typography>
        </Box>

        <Button
          variant={status === "success" ? "outlined" : "contained"}
          color={status === "success" ? "success" : "primary"}
          onClick={handleCapture}
          disabled={loading}
          startIcon={
            status === "success" ? <CheckCircleIcon /> : <FingerprintIcon />
          }
        >
          {status === "success" ? "Recapturar" : "Capturar"}
        </Button>
      </Stack>

      {value && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            bgcolor: "white",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", color: "text.secondary" }}
          >
            ID SESSÃO: {value.substring(0, 16)}...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
