import { useState } from "react";
import { useInput } from "react-admin";
import {
  Paper,
  Stack,
  Box,
  Typography,
  Button,
  LinearProgress,
  alpha,
} from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { Fingerprint, CheckCircle2, RefreshCw } from "lucide-react";
import { biometricService } from "../../../services/biometricService";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

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
  const [status, setStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);

  const handleCapture = async () => {
    setStatus("scanning");
    setProgress(0);

    try {
      const { session_id } = await biometricService.requestCapture(operatorId);

      const interval = setInterval(async () => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));

        const identifier = await biometricService.fetchHash(session_id);
        if (identifier) {
          onChange(identifier);
          setStatus("success");
          setProgress(100);
          clearInterval(interval);
        }
      }, 2000);
    } catch {
      setStatus("error");
    }
  };

  const isSuccess = status === "success" || !!value;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: isSuccess ? "success.light" : "divider",
        bgcolor: isSuccess
          ? (theme) => alpha(theme.palette.success.main, 0.04)
          : "grey.50",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: isSuccess
              ? "success.main"
              : status === "scanning"
                ? "primary.main"
                : "white",
            color:
              isSuccess || status === "scanning" ? "white" : "text.disabled",
            boxShadow: isSuccess
              ? (theme) =>
                  `0 8px 20px ${alpha(theme.palette.success.main, 0.3)}`
              : "none",
            transition: "all 0.3s ease",
          }}
        >
          {status === "scanning" ? (
            <Box
              component="span"
              sx={{
                display: "flex",
                animation: `${spin} 1s linear infinite`,
              }}
            >
              <RefreshCw />
            </Box>
          ) : isSuccess ? (
            <CheckCircle2 />
          ) : (
            <Fingerprint size={32} />
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Identidade Biométrica
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {isSuccess
              ? "Assinatura digital vinculada"
              : "Posicione o dedo no leitor para iniciar"}
          </Typography>
          {status === "scanning" && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 1, height: 4, borderRadius: 2 }}
            />
          )}
        </Box>

        <Button
          variant={isSuccess ? "text" : "contained"}
          color={isSuccess ? "success" : "primary"}
          onClick={handleCapture}
          startIcon={
            isSuccess ? <RefreshCw size={16} /> : <Fingerprint size={16} />
          }
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {isSuccess ? "Recapturar" : "Iniciar Leitura"}
        </Button>
      </Stack>
    </Paper>
  );
};
