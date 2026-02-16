import { alpha } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

export const listMainTransparentSx: SystemStyleObject<Theme> = {
  "& .RaList-main": {
    boxShadow: "none",
    bgcolor: "transparent",
  },
};

export const listCardSx: SystemStyleObject<Theme> = {
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
  overflow: "hidden",
};

export const datagridBaseSx: SystemStyleObject<Theme> = {
  "& .RaDatagrid-tableWrapper": { overflowX: "auto" },
  "& .MuiTableCell-head": { bgcolor: "background.default" },
};

export const datagridHoverSx: SystemStyleObject<Theme> = {
  "& .MuiTableRow-root:hover": {
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
  },
};
