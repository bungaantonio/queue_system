// src/modules/shared/styles/listStyles.ts
import { alpha } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

export const listMainTransparentSx: SystemStyleObject<Theme> = {
  "& .RaList-main": {
    boxShadow: "none",
    bgcolor: "transparent",
    border: "none",
  },
  // Remove o Paper que o react-admin envolve automaticamente à volta do List
  "& .MuiPaper-root": {
    boxShadow: "none",
    bgcolor: "transparent",
    border: "none",
    borderRadius: 0,
  },
};

export const listCardSx: SystemStyleObject<Theme> = {
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  overflow: "hidden",
  boxShadow: "none",
};

export const datagridBaseSx: SystemStyleObject<Theme> = {
  "& .RaDatagrid-tableWrapper": { overflowX: "auto" },
  "& .MuiTableCell-root": {
    borderColor: (theme: Theme) => alpha(theme.palette.divider, 0.6),
    py: 1.25,
  },
  "& .MuiTableCell-head": {
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.04),
    fontWeight: 800,
    fontSize: "0.68rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "text.primary",
    borderBottom: "2px solid",
    borderBottomColor: (theme: Theme) =>
      alpha(theme.palette.primary.main, 0.15),
  },
};

export const datagridHoverSx: SystemStyleObject<Theme> = {
  "& .MuiTableRow-root": {
    transition: "background 0.15s ease",
  },
  "& .MuiTableRow-root:hover": {
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.04),
    cursor: "pointer",
  },
};
