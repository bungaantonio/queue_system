import { Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface StatusChipProps extends Omit<ChipProps, "size"> {
  uppercase?: boolean;
}

export const StatusChip = ({
  label,
  uppercase = true,
  sx,
  ...rest
}: StatusChipProps) => {
  const normalizedLabel =
    uppercase && typeof label === "string" ? label.toUpperCase() : label;

  const baseSx: SxProps<Theme> = {
    height: 22,
    "& .MuiChip-label": {
      px: 1,
      fontSize: "0.62rem",
      fontWeight: 900,
      letterSpacing: "0.08em",
    },
  };

  return (
    <Chip
      {...rest}
      size="small"
      label={normalizedLabel}
      sx={[baseSx, sx].filter(Boolean) as SxProps<Theme>}
    />
  );
};
