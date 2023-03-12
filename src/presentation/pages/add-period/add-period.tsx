import * as React from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, FormControl, FormHelperText, TextField } from "@mui/material"
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { AddPeriod } from '../../../domain/usecase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

type Props = {
  addPeriod: AddPeriod
}

type State = AddPeriod.Params & {
  loading: boolean
  formValid: boolean
}

const AddPeriodForm: React.FC<Props> = ( {addPeriod} : Props ) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

  const [state, setState] = React.useState<State>({
    name: '',
    startDate: '',
    endDate: '',
    budget: 0,
    categories: [],
    loading: false,
    formValid: false
  })

  const handleRedirect = (route: string) => {
    navigate(route)
  }

  const validate = React.useCallback(() => {
    setState((state) => ({
      ...state,
      formValid: 
        state.name !== '' && 
        state.budget > 0 && 
        state.startDate !== '' &&
        state.startDate <= state.endDate &&
        state.endDate !== ''
    }))
  }, [])

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

    validate();
  }

  const handleSubmit = async () => {
    setState((state) => ({
      ...state,
      loading: true
    }))

    const { name, startDate, endDate, budget, categories } = state

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

      handleRedirect('/periods')
    }).catch((error) => {
      setState((state) => ({
        ...state,
        loading: false
      }))
    })
  }

  return (
    <>
    <div className="container-app">
      <Card>
        <CardHeader title="Add Period" className="card-header" />

        <CardContent>
          <form>
            <TextField
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

            <TextField
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

                  validate();
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

                  validate();
                }}
                minDate={startDate}
                disabled={state.loading}
              />
              <FormHelperText>
                {state.endDate === '' ? 'This field is required' : ''}
              </FormHelperText>
            </FormControl>
          </form>
        </CardContent>

        <CardActions className='d-flex-right'>
          <Button
            color="secondary"
            onClick={() => handleRedirect('/periods')}
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