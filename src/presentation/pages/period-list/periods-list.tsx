import React from "react"
import { Button, Card, CardContent, CardHeader, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material"
import { LoadPeriods } from "../../../domain/usecase"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import { Period } from "../../../domain/model";
import { TablePaginationActions } from "../../components/table";
import { NotficationToaster, NotificationParams } from "../../components/notification";

type Props = {
  loadPeriods: LoadPeriods
}

const PeriodList: React.FC<Props> = ({ loadPeriods }: Props) => {
  const navigate = useNavigate();
  const [data, setData] = React.useState<Period[]>([])
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [showNotification, setShowNotification] = React.useState<NotificationParams>({
    message: '',
    type: 'success',
    open: false,
  });

  React.useEffect(() => {
    loadPeriods
      .load()
      .then((periods) => {
        setData(periods)
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
  }, [loadPeriods])

  const handleRedirect = (route: string) => {
    navigate(route);
  }

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

  return (
    <>
      <NotficationToaster
        type={showNotification.type}
        message={showNotification.message}
        open={showNotification.open}
        setOpen={() => setShowNotification({ ...showNotification, open: false })}
      />

      <div className="container-app">
        <Card>
          <CardHeader
            title="Periods"
            action = {
              <Button
                variant="outlined"
                className='button-new'
                endIcon={<AddIcon className='icon' />}
                onClick={() => handleRedirect('/periods/add')}
              >
                New
              </Button>
            }
            className="card-header"
          >
          </CardHeader>

          <CardContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {
                    loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
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
                          <TableCell component="th" scope="row" width={100}>
                            {row.id}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {row.name}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {formatCurrency(row.budget)}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleRedirect(`/periods/${row.id}`)}
                            >
                              <EditIcon
                                htmlColor='#9d5bff'
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
                          colSpan={4}
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

export default PeriodList
