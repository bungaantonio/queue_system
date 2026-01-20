// src/utentes/UtentesList.tsx
import React from "react";
import { List, ListProps, useListContext } from "react-admin";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { JSX } from "react/jsx-runtime";

const UtentesGrid = () => {
  const {
    data,
    isLoading,
    total,
    page,
    perPage,
    setPage,
    setPerPage,
    sort,
    setSort,
  } = useListContext();

  const rows = data ? Object.values(data) : [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nome", width: 200 },
    { field: "birth_date", headerName: "Data Nascimento", width: 150 },
    { field: "phone", headerName: "Telefone", width: 150 },
    {
      field: "is_pregnant",
      headerName: "Grávida?",
      width: 120,
      type: "boolean",
    },
    {
      field: "is_disabled_temp",
      headerName: "Deficiência?",
      width: 140,
      type: "boolean",
    },
    { field: "attendance_type", headerName: "Tipo Atendimento", width: 140 },
    { field: "operator_id", headerName: "Operador", width: 100 },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowCount={total}
        pagination
        paginationMode="server"
        paginationModel={{ page: page - 1, pageSize: perPage }}
        onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
          setPage(newPage + 1);
          setPerPage(newPageSize);
        }}
        sortingMode="server"
        sortModel={
          sort
            ? [
                {
                  field: sort.field,
                  sort: sort.order.toLowerCase() as "asc" | "desc",
                },
              ]
            : []
        }
        onSortModelChange={(model) => {
          if (model.length > 0 && model[0].sort) {
            setSort({
              field: model[0].field,
              order: model[0].sort.toUpperCase() as "ASC" | "DESC",
            });
          }
        }}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export const UtentesList = (
  props: JSX.IntrinsicAttributes & ListProps<any>,
) => (
  <List {...props} perPage={10} sort={{ field: "id", order: "ASC" }}>
    <UtentesGrid />
  </List>
);
