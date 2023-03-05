import * as React from 'react';
import {  Container, TableFooter, TablePagination } from "@mui/material";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePaginationActions } from '../../components/table';

type Category = {
  id: number;
  name: string;
  description: string;
}

const CategoriesIndex = () => {
  const [data, setData] = React.useState<Category[]>([])

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    setData([
      { id: 1, name: 'Moradia', description: 'Inclui gastos com moradia, manuntenção, etc...'},
      { id: 2, name: 'Transporte', description: 'Inclui gasto com veículo, combustíveis, etc...' },
      { id: 3, name: 'Alimentação', description: 'Inclui gastos com mercado, restaurantes, lanches etc...' },
      { id: 4, name: 'Moradia', description: 'Inclui gastos com moradia, manuntenção, etc...'},
      { id: 5, name: 'Transporte', description: 'Inclui gasto com veículo, combustíveis, etc...' },
      { id: 6, name: 'Alimentação', description: 'Inclui gastos com mercado, restaurantes, lanches etc...' },
      { id: 7, name: 'Moradia', description: 'Inclui gastos com moradia, manuntenção, etc...'},
      { id: 8, name: 'Transporte', description: 'Inclui gasto com veículo, combustíveis, etc...' },
      { id: 9, name: 'Alimentação', description: 'Inclui gastos com mercado, restaurantes, lanches etc...' },
      { id: 10, name: 'Moradia', description: 'Inclui gastos com moradia, manuntenção, etc...'},
      { id: 11, name: 'Transporte', description: 'Inclui gasto com veículo, combustíveis, etc...' },
      { id: 12, name: 'Alimentação', description: 'Inclui gastos com mercado, restaurantes, lanches etc...' },
      { id: 13, name: 'Moradia', description: 'Inclui gastos com moradia, manuntenção, etc...'},
      { id: 14, name: 'Transporte', description: 'Inclui gasto com veículo, combustíveis, etc...' },
      { id: 15, name: 'Alimentação', description: 'Inclui gastos com mercado, restaurantes, lanches etc...' },
    ])
  }, [])

  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container
      className="container"
      maxWidth="xl"
    >
      <div className="container-app">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (rowsPerPage > 0
                  ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : data
                ).map(
                  (row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" width={100}>
                        {row.id}
                      </TableCell>

                      <TableCell component="th" scope="row" width={300}>
                        {row.name}
                      </TableCell>

                      <TableCell>{row.description}</TableCell>
                    </TableRow>
                  )
                )
              }

              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 15, 30, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}

export default CategoriesIndex;