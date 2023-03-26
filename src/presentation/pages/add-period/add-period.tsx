import * as React from 'react';
import { Alert, AlertTitle, Button, Card, CardActions, CardContent, CardHeader, FormControl, FormHelperText } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { AddPeriod, LoadCategories } from '../../../domain/usecase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { NotficationToaster, NotificationParams } from '../../components/notification';
import { RemoteCategoryResultModel } from '../../../domain/model';
import SaveIcon from '@mui/icons-material/Save';
import MasterDetail from './components/MasterDetail';
import Input from '../../components/input/Input';

type Props = {
  addPeriod: AddPeriod
  loadCategories: LoadCategories
}

type State = AddPeriod.Params & {
  loading: boolean
  formValid: boolean
  notification: NotificationParams
}

const AddPeriodForm: React.FC<Props> = ({addPeriod, loadCategories} : Props) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [categories, setCategories] = React.useState<RemoteCategoryResultModel[]>([]);
  const [hasBudgetError, setHasBudgetError] = React.useState(false);

  const [state, setState] = React.useState<State>({
    name: '',
    startDate: '',
    endDate: '',
    budget: 0,
    categories: [],
    loading: false,
    formValid: false,
    notification: {
      message: '',
      type: 'success',
      open: false,
    }
  })

  React.useEffect(() => {
    loadCategories.load().then((categories) => {
      setCategories(categories)
    })
  }, [loadCategories])

  const handleRedirect = (route: string, notification?: NotificationParams) => {
    navigate(route, {
      replace: true,
      state: {
        notification
      }
    })
  }

  const sumCategoriesBudget = React.useCallback(() => {
    return state.categories.reduce((acc, cur) => {
      return acc + Number(cur.budget)
    }, 0)
  }, [state.categories])

  React.useEffect(() => {
    const categoriesBudget = sumCategoriesBudget()

    setState((state) => ({
      ...state,
      formValid:
        state.name !== '' &&
        state.budget > 0 &&
        state.startDate !== '' &&
        state.startDate <= state.endDate &&
        state.endDate !== '' &&
        state.categories.length > 0 &&
        state.categories.every((c) => c.budget > 0) &&
        Number(state.budget) >= categoriesBudget
    }))

    setHasBudgetError(Number(state.budget) < categoriesBudget)
  }, [state.name, state.budget, state.startDate, state.endDate, state.categories, sumCategoriesBudget])

  const handleChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    let value: any = e.target.value
    if (field === 'budget') {
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

  const handleRemoveCategory = (id: number) => {
    setState((state) => ({
      ...state,
      categories: state.categories.filter((c) => c.category.id !== id)
    }))
  }

  const handleAddCategory = (data: AddPeriod.RemoteAddPeriodCategory) => {
    const categoryExists = state.categories.find((c) => c.category.id === data.category.id)

    if (categoryExists) {
      setState((state) => ({
        ...state,
        categories: state.categories.map((c) => {
          if (c.category.id === data.category.id) {
            return data
          }

          return c
        })
      }))

      return
    }

    setState((state) => ({
      ...state,
      categories: [...state.categories, data]
    }))
  }

  const handleSubmit = async () => {
    setState((state) => ({
      ...state,
      loading: true
    }))

    const { name, startDate, endDate, budget, categories } = state

    const categoriesBudget = categories.reduce((acc, cur) => {
      return acc + Number(cur.budget)
    }, 0)

    if (categoriesBudget > Number(budget)) {
      setState((state) => ({
        ...state,
        loading: false,
        notification: {
          message: 'Categories budget is greater than period budget',
          type: 'error',
          open: true
        },
        formValid: false
      }))

      return
    }

    await addPeriod.add({
      name,
      startDate,
      endDate,
      budget,
      categories
    })
    .then(() => {
      setState((state) => ({
        ...state,
        loading: false
      }))

      handleRedirect('/periods', {
        message: 'Period added successfully',
        type: 'success',
        open: true
      })
    }).catch((error) => {
      setState((state) => ({
        ...state,
        loading: false,
        notification: {
          message: error.message,
          type: 'error',
          open: true
        }
      }))
    })
  }

  return (
    <>
      <div className="container-app">
        {  
          hasBudgetError && 
            <Alert severity="warning"
              style={{
                backgroundColor: '#ff9a2275',
                color: '#fff'
              }}
            >
              <AlertTitle>Warning</AlertTitle>
              Categories budget is greater than period budget
            </Alert>
        }

        <NotficationToaster
          type={state.notification.type}
          message={state.notification.message}
          open={state.notification.open}
          setOpen={() => {
            setState((state) => ({
              ...state,
              notification: {
                ...state.notification,
                open: false
              }
            }))
          }}
        />

        <Card>
          <CardHeader title="Add Period" className="card-header" />

          <CardContent style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <form>
              <Input
                sx={{ m: 1, width: '25ch' }}
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                value={state.name}
                onChange={(e) => handleChanges(e, 'name')}
                variant="outlined"
                helperText={state.name === '' ? 'This field is required' : ''}
                color={state.name === '' ? 'secondary' : 'success'}
                disabled={state.loading}
                required
              />

              <Input
                sx={{ m: 1, width: '25ch' }}
                margin="dense"
                id="budget"
                label="Budget (R$)"
                value={state.budget}
                type="text"
                onChange={(e) => handleChanges(e, 'budget')}
                variant="outlined"
                helperText={state.budget <= 0 ? 'This field is required' : ''}
                color={state.budget <= 0 ? 'secondary' : 'success'}
                disabled={state.loading}
                required
                inputProps={{min: 0, style: { textAlign: 'right' }}}
              />

              <FormControl
                sx={{ m: 1, width: '25ch' }}
                variant="outlined"
                margin='dense'
                required
              >
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    const date = new Date((newValue?.toDate() || new Date())).toLocaleDateString('en-CA', { timeZone: 'Europe/Andorra' })

                    setState((state) => ({
                      ...state,
                      startDate: date
                    }))
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: "#F79D9F"
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#F79D9F"
                      }
                    }
                  }}
                  disabled={state.loading}
                />
                <FormHelperText>
                  {state.startDate === '' ? 'This field is required' : ''}
                </FormHelperText>
              </FormControl>

              <FormControl
                sx={{ m: 1, width: '25ch' }}
                variant="outlined"
                margin='dense'
                color={state.startDate === '' ? 'secondary' : 'success'}
                required
              >
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                    const date = new Date((newValue?.toDate() || new Date())).toLocaleDateString('en-CA', { timeZone: 'Europe/Andorra' })

                    setState((state) => ({
                      ...state,
                      endDate: date
                    }))
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: "#F79D9F"
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#F79D9F"
                      }
                    }
                  }}
                  minDate={startDate}
                  disabled={state.loading}
                />
                <FormHelperText>
                  {state.endDate === '' ? 'This field is required' : ''}
                </FormHelperText>
              </FormControl>
            </form>

            <MasterDetail
              title='Categories'
              data={state.categories}
              onAdd={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
              categories={categories}
            />
          </CardContent>

          <CardActions className='d-flex-right card-footer'>
            <Button
              color="secondary"
              onClick={() => handleRedirect('/periods', undefined)}
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

export default AddPeriodForm
