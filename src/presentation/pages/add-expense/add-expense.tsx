import { LoadingButton } from "@mui/lab"
import { Autocomplete, Button, Card, CardActions, CardContent, FormControl, FormHelperText, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import React from "react"
import { RemoteCategoryResultModel, RemotePeriodListResultModel } from "../../../domain/model"
import { AddExpense, LoadPeriodCategories, LoadPeriods } from "../../../domain/usecase"
import { NotificationParams } from "../../components/notification"
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom"

type Props = {
  addExpense: AddExpense
  loadPeriods: LoadPeriods
  loadPeriodCategories: LoadPeriodCategories
}

type State = AddExpense.Params & {
  loading: boolean
  formValid: boolean
  notification: NotificationParams
}

const AddExpenseForm: React.FC<Props> = ({ addExpense, loadPeriods, loadPeriodCategories }) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const navigate = useNavigate();
  const [periods, setPeriods] = React.useState<RemotePeriodListResultModel[]>([])
  const [categories, setCategories] = React.useState<RemoteCategoryResultModel[]>([])

  const [period, setPeriod] = React.useState<RemotePeriodListResultModel | null>(null)
  const [category, setCategory] = React.useState<RemoteCategoryResultModel | null>(null)

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

  React.useEffect(() => {
    if (period) {
      loadPeriodCategories
        .load(period.id.toString())
        .then((result) => {
          const categories = result.map((item) => item.category)
          setCategories(categories)
        })
    }
  }, [loadPeriodCategories, period])

  const handleRedirect = (route: string, notification?: NotificationParams) => {
    navigate(route, {
      replace: true,
      state: {
        notification
      }
    })
  }

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

  const handleSubmit = async () => {
    setState((state) => ({
      ...state,
      loading: true
    }))

    await addExpense
      .add(state)
      .then(() => {
        handleRedirect('/expenses', {
          message: 'Expense added successfully',
          type: 'success',
          open: true,
        })
      })
      .catch((error) => {
        setState((state) => ({
          ...state,
          loading: false,
          notification: {
            message: error.message,
            type: 'error',
            open: true,
          }
        }))
      })
  }

  return (
    <>
      <div className="container-app">
        <Card>
          <CardContent style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            <form>
              <div className="d-flex wrapp">
                <Autocomplete
                  disablePortal={false}
                  id="period_combo_box"
                  options={periods}
                  value={period}
                  getOptionLabel={(option) => option.name}
                  sx={{ width: 300, marginTop: '1%', marginRight: '1%' }}
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

                <Autocomplete
                  disablePortal={false}
                  id="category_combo_box"
                  options={categories}
                  value={category}
                  getOptionLabel={(option) => option.name}
                  sx={{ width: 300, marginTop: '1%', marginRight: '1%' }}
                  onChange={(e, value) => {
                    setCategory(value)
                    setState({
                      ...state,
                      categoryId: value?.id || 0
                    })
                  }}
                  renderInput={(params) => <TextField {...params} label="Categories" />}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={period === null}
                />

                <TextField
                  sx={{ m: 1, width: '25ch' }}
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
                    label="Date"
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                      const date = new Date((newValue?.toDate() || new Date())).toLocaleDateString('en-CA', { timeZone: 'Europe/Andorra' })

                      setState((state) => ({
                        ...state,
                        date: date
                      }))
                    }}
                    minDate={dayjs(period?.startDate || '').tz('Europe/Andorra')}
                    maxDate={dayjs(period?.endDate || '').tz('Europe/Andorra')}
                    disabled={state.loading}
                  />
                  <FormHelperText>
                    {state.date === '' ? 'This field is required' : ''}
                  </FormHelperText>
                </FormControl>
              </div>
            </form>
          </CardContent>

          <CardActions className='d-flex-right card-footer'>
            <Button
              color="secondary"
              onClick={() => handleRedirect('/expenses', undefined)}
              className="button-cancel"
              variant='outlined'
            >
              <span className='button-label'>Cancel</span>
            </Button>

            <LoadingButton
              color="secondary"
              loadingPosition="end"
              endIcon={<SaveIcon className='icon'/>}
              variant="contained"
              className="button-new"
              loading={state.loading}
              disabled={!state.formValid}
              onClick={handleSubmit}
            >
              <span className='button-label'>Save</span>
            </LoadingButton>
          </CardActions>
        </Card>
      </div>
    </>
  )
}

export default AddExpenseForm
