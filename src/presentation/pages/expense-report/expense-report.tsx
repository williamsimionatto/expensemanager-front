import { Autocomplete, Card, CardContent, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import React from "react"
import { RemoteExpenseResultModel, RemotePeriodCategoryResultModel, RemotePeriodListResultModel, RemotePeriodResultModel } from "../../../domain/model"
import { LoadPeriodById, LoadPeriods } from "../../../domain/usecase"
import AssessmentIcon from '@mui/icons-material/Assessment';
import { LoadingButton } from "@mui/lab";
import './style/expense-report.css'
import ProgressBar from "../../components/progessbar/ProgressBar";

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
        setPeriods(result)
        const usedBudget = sumUsedBudgetPeriod()
        setUsedBudget(usedBudget)
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
    const { data } = props
    const total = data.expenses.reduce((acc, expense) => {
      return acc + expense.amount
    }, 0)

    return (
      <React.Fragment>
        <TableRow>
          <TableCell colSpan={2}>{data.category.name}</TableCell>
          <TableCell>{formatCurrency(data.budget)}</TableCell>
          <TableCell>{formatCurrency(total)}</TableCell>

          <TableCell component="th" scope="row" width={150}>
              <ProgressBar value={(total / data.budget) * 100} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell colSpan={2}>Description</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell colSpan={2}></TableCell>
        </TableRow>

        {
          data.expenses.map((expense: RemoteExpenseResultModel) => (
            <TableRow key={expense.id}>
              <TableCell component="th" scope="row" colSpan={2}>
                {expense.description}
              </TableCell>
              <TableCell>{formatCurrency(expense.amount)}</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          ))
        }
      </React.Fragment>
    )
  }

  return (
    <>
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
                          <TableCell component="th" scope="row" width={150}>
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
