import React from "react";
import { List, ListProps, useListContext } from "react-admin";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
// Adicionado Chip na importação abaixo
import { Box, Chip } from "@mui/material";

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

  // Converte o objeto de dados em array para o DataGrid
  const rows = data ? Object.values(data) : [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nome", width: 200 },
    { field: "birth_date", headerName: "Data Nascimento", width: 150 },
    { field: "phone", headerName: "Telefone", width: 150 },
    {
      field: "attendance_type",
      headerName: "Tipo",
      width: 140,
      renderCell: (params) => {
        // Lógica de cores para os Chips
        const colors: Record<
          string,
          "success" | "warning" | "error" | "default"
        > = {
          normal: "success",
          priority: "warning",
          urgent: "error",
        };
        const status = params.value as string;
        return (
          <Chip
            label={status || "N/A"}
            color={colors[status] || "default"}
            size="small"
          />
        );
      },
    },
    {
      field: "is_pregnant",
      headerName: "Grávida",
      width: 100,
      type: "boolean",
    },
    { field: "operator_id", headerName: "Operador", width: 100 },
  ];

  return (
    <Box sx={{ height: 500, width: "100%", mt: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowCount={total || 0}
        pagination
        paginationMode="server"
        // Define o modelo de paginação atual
        paginationModel={{ page: page - 1, pageSize: perPage }}
        // Atualiza a página ou o tamanho da página
        onPaginationModelChange={(model) => {
          setPage(model.page + 1);
          setPerPage(model.pageSize);
        }}
        // CORREÇÃO: Adicionado o 10 aqui para parar o erro de pageSizeOptions
        pageSizeOptions={[10, 25, 50, 100]}
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
          if (model.length > 0) {
            setSort({
              field: model[0].field,
              order: model[0].sort?.toUpperCase() as "ASC" | "DESC",
            });
          }
        }}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export const UtentesList = (props: ListProps) => (
  <List {...props} perPage={10} sort={{ field: "id", order: "ASC" }}>
    <UtentesGrid />
  </List>
);
