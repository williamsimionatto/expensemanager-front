import { Autocomplete, Card, CardContent, FormControl, FormHelperText, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { Dayjs } from "dayjs"
import React from "react"
import { RemotePeriodListResultModel } from "../../../domain/model"
import { AddExpense, LoadPeriods } from "../../../domain/usecase"
import { NotificationParams } from "../../components/notification"

type Props = {
  addExpense: AddExpense
  loadPeriods: LoadPeriods
}

type State = AddExpense.Params & {
  loading: boolean
  formValid: boolean
  notification: NotificationParams
}

const AddExpenseForm: React.FC<Props> = ({ addExpense, loadPeriods }) => {
  const [periods, setPeriods] = React.useState<RemotePeriodListResultModel[]>([])
  const [period, setPeriod] = React.useState<RemotePeriodListResultModel | null>(null)
  const [date, setDate] = React.useState<Dayjs | null>(null);

  const [state, setState] = React.useState<State>({
    periodId: 0,
    categoryId: 0,
    description: '',
    amount: 0,
    date: '',
    loading: false,
    formValid: false,
    notification: {
      message: '',
      type: 'success',
      open: false,
    }
  })

  React.useEffect(() => {
    loadPeriods.load().then((result) => {
      setPeriods(result)
    })
  }, [loadPeriods])

  const handleChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    let value: any = e.target.value
    if (field === 'amount') {
      const pattern = /^\d*\.?\d{0,2}$/
      if (!pattern.test(value)) {
        return
      }
    }

    setState((state) => ({
      ...state,
      [field]: value
    }))
  }

  return (
    <>
      <div className="container-app">
        <Card>
          <CardContent style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <form>
              <Autocomplete
                disablePortal={false}
                id="period_combo_box"
                options={periods}
                value={period}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300, marginTop: '1%' , marginRight: '3%' }}
                onChange={(e, value) => {
                  setPeriod(value)
                  setState({
                    ...state,
                    periodId: value?.id || 0
                  })
                }}
                renderInput={(params) => <TextField {...params} label="Period" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />

              <TextField
                sx={{ m: 1, width: '25ch' }}
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                type="text"
                value={state.description}
                onChange={(e) => handleChanges(e, 'name')}
                variant="outlined"
                helperText={state.description === '' ? 'This field is required' : ''}
                color={state.description === '' ? 'secondary' : 'success'}
                disabled={state.loading}
                required
              />

              <TextField
                sx={{ m: 1, width: '25ch' }}
                margin="dense"
                id="amount"
                label="Amount (R$)"
                value={state.amount}
                type="text"
                onChange={(e) => handleChanges(e, 'amount')}
                variant="outlined"
                helperText={state.amount <= 0 ? 'This field is required' : ''}
                color={state.amount <= 0 ? 'secondary' : 'success'}
                disabled={state.loading}
                required
                inputProps={{min: 0, style: { textAlign: 'right' }}}
              />

              <FormControl
                sx={{ m: 1, width: '25ch' }}
                variant="outlined"
                margin='dense'
                color={state.date === '' ? 'secondary' : 'success'}
                required
              >
                <DatePicker
                  label="End Date"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                    const date = new Date((newValue?.toDate() || new Date())).toLocaleDateString('en-CA', { timeZone: 'Europe/Andorra' })

                    setState((state) => ({
                      ...state,
                      date: date
                    }))
                  }}
                  minDate={new Dayjs(period?.startDate || '')}
                  maxDate={new Dayjs(period?.endDate || '')}
                  disabled={state.loading}
                />
                <FormHelperText>
                  {state.date === '' ? 'This field is required' : ''}
                </FormHelperText>
              </FormControl>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default AddExpenseForm
