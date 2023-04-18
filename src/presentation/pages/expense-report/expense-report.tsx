import { Autocomplete, Card, CardContent, CardHeader, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import React from "react"
import { RemoteExpenseResultModel, RemotePeriodCategoryResultModel, RemotePeriodListResultModel, RemotePeriodResultModel } from "../../../domain/model"
import { LoadPeriodById, LoadPeriods } from "../../../domain/usecase"
import AssessmentIcon from '@mui/icons-material/Assessment';
import { LoadingButton } from "@mui/lab";
import ProgressBar from "../../components/progessbar/ProgressBar";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box } from "@mui/system";
import { NotficationToaster, NotificationParams } from "../../components/notification";

import './style/expense-report.css'

type Props = { 
  loadPeriods: LoadPeriods
  loadPeriodById: LoadPeriodById
}

const ExpenseReport: React.FC<Props> = ({ loadPeriods, loadPeriodById }: Props) => {
  const [loading, setLoading] = React.useState(false)
  const [periods, setPeriods] = React.useState<RemotePeriodListResultModel[]>([])
  const [period, setPeriod] = React.useState<RemotePeriodListResultModel | null>(null)
  const [data, setData] = React.useState<RemotePeriodResultModel | null>(null)
  const [usedBudget, setUsedBudget] = React.useState(0)

  const [showNotification, setShowNotification] = React.useState<NotificationParams>({
    message: '',
    type: 'success',
    open: false,
  });

  const sumUsedBudgetPeriod = React.useCallback(() => {
    const categories = data?.categories.map((category) => category)
    let expenses: RemoteExpenseResultModel[] = []

    categories?.forEach((category) => {
      category.expenses.forEach((expense) => {
        expenses.push(expense)
      })
    })

    const usedBudget = expenses.reduce((acc, expense) => {
      return acc + expense.amount
    }, 0)

    return usedBudget
  }, [data])

  React.useEffect(() => {
    loadPeriods
      .load()
      .then((result) => {
        result.sort((a, b) => {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        })
        setPeriods(result)
        const usedBudget = sumUsedBudgetPeriod()
        setUsedBudget(usedBudget)
      }).catch((error) => {
        setShowNotification({
          message: 'Error loading periods',
          type: 'error',
          open: true,
        })
      })
  }, [loadPeriods, sumUsedBudgetPeriod])

  const handleGenerateReport = async () => {
    setLoading(true)
    await loadPeriodById
      .loadById((period?.id ?? 0).toString())
      .then((result) => {
        setData(result)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function CategoryRow(props: { data: RemotePeriodCategoryResultModel }) {
    const [rowOpen, setRowOpen] = React.useState(false);
    const { data } = props
    const total = data.expenses.reduce((acc, expense) => {
      return acc + expense.amount
    }, 0)

    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setRowOpen(!rowOpen)}
            >
              {rowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}{data.category.name}
            </IconButton>
          </TableCell>

          <TableCell></TableCell>
          <TableCell>{formatCurrency(data.budget)}</TableCell>
          <TableCell>{formatCurrency(total)}</TableCell>

          <TableCell component="th" scope="row" width={150}>
            <ProgressBar value={(total / data.budget) * 100} />
          </TableCell>
        </TableRow>


        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={rowOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table 
                  size="small"
                  sx={{
                    marginLeft: 0,
                    borderBottom: 'none'
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      data.expenses.map((expense: RemoteExpenseResultModel) => (
                        <TableRow key={expense.id}>
                          <TableCell component="th" scope="row" width={150}>
                            {expense.description}
                          </TableCell>
                          <TableCell width={120}>{new Date(expense.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell width={120}>{formatCurrency(expense.amount)}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
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
            title="Expense Report"
            className="card-header"
          >
          </CardHeader>

          <CardContent>
            <div className="d-flex">
              <Autocomplete
                disablePortal={false}
                id="period_combo_box"
                options={periods}
                value={period}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300, marginTop: '1.4%', marginRight: '1%' }}
                onChange={(e, value) => {
                  setPeriod(value)
                }}
                renderInput={(params) => <TextField {...params} label="Period" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />

              <LoadingButton
                color="secondary"
                loadingPosition="end"
                endIcon={<AssessmentIcon className='icon'/>}
                variant="contained"
                className="button-new"
                loading={loading}
                disabled={period === null}
                sx={{ height: 56, marginTop: '1.4%', marginLeft: '2%' }}
                onClick={handleGenerateReport}
              >
                <span className='button-label'>Generate</span>
              </LoadingButton>
            </div>

            {
              data && (
                <div className="report-table">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650, mt: 2 }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Period</TableCell>
                          <TableCell>Budget</TableCell>
                          <TableCell>Used Budget</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow
                          key={data.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" width={150} sx={{
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}>
                            {data.name}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {new Date(data.startDate).toLocaleDateString('pt-BR')} - {new Date(data.endDate).toLocaleDateString('pt-BR')}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {formatCurrency(data.budget)}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            {formatCurrency(usedBudget)}
                          </TableCell>

                          <TableCell component="th" scope="row" width={150}>
                            <ProgressBar value={(usedBudget / data.budget) * 100} />
                          </TableCell>
                        </TableRow>

                        {data.categories.map((category) => (
                          <CategoryRow key={category.id} data={category} />
                        ))}

                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )
            }
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ExpenseReport
