import * as React from 'react';
import { Card, CardContent, CircularProgress, IconButton, TableFooter, TablePagination } from "@mui/material";
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePaginationActions } from '../../components/table';
import { CardHeader } from '@mui/material';

import './index.css'
import AddIcon from '@mui/icons-material/Add';
import { LoadCategories } from '../../../domain/usecase';
import { NotficationToaster, NotificationParams } from '../../components/notification';
import { Category } from '../../../domain/model';
import { useNavigate, useLocation } from 'react-router-dom';

type Props = {
  loadCategories: LoadCategories
}

const CategoryList: React.FC<Props> = ({ loadCategories }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = React.useState<Category[]>([])
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
      setShowNotification({
        message: notification?.message || 'Category inserted successfully',
        type: notification?.type || 'success',
        open: true,
      })
    }

    navigate(location.pathname, { state: null})
  }, [location.state, location.pathname, navigate])

  React.useEffect(() => {
    loadCategories
      .load()
      .then((categories) => {
        setData(categories)
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
  }, [loadCategories])

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

  const handleRedirect = (route: string) => {
    navigate(route);
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
            title = "Categories"
            action = {
              <Button
                variant="outlined"
                className='button-new'
                endIcon={<AddIcon className='icon' />}
                onClick={() => handleRedirect('/categories/add')}
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
                    <TableCell>Description</TableCell>
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
                            <TableCell align="right">
                              <IconButton 
                                aria-label="edit"
                              >
                                <EditIcon 
                                  htmlColor='#9d5bff'
                                  fontSize='small'
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      )
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
  );
}

export default CategoryList;