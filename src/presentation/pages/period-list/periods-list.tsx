import React from "react"
import { Button, Card, CardContent, CardHeader, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material"
import { LoadPeriods } from "../../../domain/usecase"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation, useNavigate } from "react-router-dom";
import { RemotePeriodListResultModel } from "../../../domain/model";
import { TablePaginationActions } from "../../components/table";
import { NotficationToaster, NotificationParams } from "../../components/notification";
import ProgressBar from "../../components/progessbar/ProgressBar";

type Props = { 
  loadPeriods: LoadPeriods
}

const PeriodList: React.FC<Props> = ({ loadPeriods }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = React.useState<RemotePeriodListResultModel[]>([])
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [showNotification, setShowNotification] = React.useState<NotificationParams>({
    message: '',
    type: 'success',
    open: false,
  });

  React.useEffect(() => {
    if (location.state) {
      const notification = location.state.notification
      if (notification) {
        setShowNotification({
          message: notification.message,
          type: notification.type,
          open: true,
        })
      }
    }

    navigate(location.pathname, { state: null})
  }, [location.state, location.pathname, navigate])

  React.useEffect(() => {
    loadPeriods
      .load()
      .then((periods) => {
        periods.sort((a, b) => {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        })

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
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
                    <TableCell>Period</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell>Used Budget</TableCell>
                    <TableCell></TableCell>
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
                          <TableCell component="th" scope="row" width={100}>
                            {row.id}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {row.name}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {formatDate(row.startDate)} - {formatDate(row.endDate)}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {formatCurrency(row.budget)}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {formatCurrency(row.usedBudget)}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            <ProgressBar value={(row.usedBudget / row.budget) * 100} />
                          </TableCell>

                          <TableCell align="right" width={100}>
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleRedirect(`/periods/${row.id}`)}
                            >
                              <EditIcon
                                htmlColor='#F64348'
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

export default PeriodList
