import { Button, Card, CardContent, CardHeader, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material"
import React from "react"
import { RemoteExpenseListResultModel } from "../../../domain/model"
import { DeleteExpense, LoadExpenses } from "../../../domain/usecase"
import { NotficationToaster, NotificationParams } from "../../components/notification"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TablePaginationActions } from "../../components/table"
import { ConfirmationDialog } from "../../components/confirmation-dialog/Confirmation-Dialog"

type Props = {
  loadExpenses: LoadExpenses
  deleteExpense: DeleteExpense
}

const ExpenseList: React.FC<Props> = ({ loadExpenses, deleteExpense }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [showDialogConfirmation, setShowDialogConfirmation] = React.useState(false)

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [deleteExpenseId, setDeleteExpenseId] = React.useState(0)

  const [data, setData] = React.useState<RemoteExpenseListResultModel[]>([])
  const [showNotification, setShowNotification] = React.useState<NotificationParams>({
    message: '',
    type: 'success',
    open: false,
  });

  React.useEffect(() => {
    loadExpenses
      .load()
      .then((expenses) => {
        setData(expenses)
        setLoading(false)
      })
      .catch(() => {
        setData([])
        setLoading(false)
        setShowNotification({
          message: 'Error loading categories',
          type: 'error',
          open: true,
        })
      })
  })

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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleDelete = () => {
    deleteExpense
      .delete(deleteExpenseId)
      .then(() => {
        const newData = data.filter((item) => item.id !== deleteExpenseId)
        setData(newData)
        setShowNotification({
          message: 'Expense deleted successfully',
          type: 'success',
          open: true,
        })

        setShowDialogConfirmation(false)
      })
      .catch((error) => {
        setShowNotification({
          message: error.message,
          type: 'error',
          open: true,
        })
      })
  }

  return (
    <>
      <NotficationToaster
        type={showNotification.type}
        message={showNotification.message}
        open={showNotification.open}
        setOpen={() => setShowNotification({ ...showNotification, open: false })}
      />

      <ConfirmationDialog
        message="Are you sure you want to delete this expense?"
        open={showDialogConfirmation}
        handleClose={() => setShowDialogConfirmation(false)}
        handleConfirm={() => handleDelete()}
      />

      <div className="container-app">
        <Card>
          <CardHeader
            title="Expenses"
            action = {
              <Button
                variant="outlined"
                className='button-new'
                endIcon={<AddIcon className='icon' />}
              >
                New
              </Button>
            }
            className="card-header"
          />

          <CardContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {
                    loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <CircularProgress color="secondary" />
                          </TableCell>
                      </TableRow>
                    ) : (
                      (rowsPerPage > 0
                        ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : data
                      ).map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" width={50}>
                            {row.id}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {row.description}
                          </TableCell>

                          <TableCell component="th" scope="row" width={80} align="right">
                            {formatCurrency(row.amount)}
                          </TableCell>

                          <TableCell component="th" scope="row" width={60} align="right">
                            {new Date(row.date).toLocaleDateString('pt-BR')}
                          </TableCell>

                          <TableCell align="right" width={50}>
                            <IconButton
                              aria-label="delete"
                              onClick={() => {
                                setDeleteExpenseId(row.id)
                                setShowDialogConfirmation(true)
                              }}
                            >
                              <DeleteIcon
                                htmlColor='red'
                                fontSize='small'
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  }
                </TableBody>

                {
                  !loading && (
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 15, 30, { label: 'All', value: -1 }]}
                          colSpan={7}
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
                  )
                }
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ExpenseList
