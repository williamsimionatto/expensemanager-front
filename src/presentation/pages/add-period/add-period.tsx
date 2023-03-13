import * as React from 'react';
import { Autocomplete, Button, Card, CardActions, CardContent, CardHeader, Fab, FormControl, FormHelperText, Table, TableBody, TableCell, TableRow, TextField } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { AddPeriod } from '../../../domain/usecase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { NotficationToaster, NotificationParams } from '../../components/notification';

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import './style/add-period.css';

type Props = {
  addPeriod: AddPeriod
}

type State = AddPeriod.Params & {
  loading: boolean
  formValid: boolean
  notification: NotificationParams
}

const AddPeriodForm: React.FC<Props> = ( {addPeriod} : Props ) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [selectedCategories, setSelectedCategories] = React.useState<any[]>([]);

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

  const handleRedirect = (route: string, notification?: NotificationParams) => {
    navigate(route, {
      replace: true,
      state: {
        notification
      }
    })
  }

  const validate = React.useCallback(() => {
    console.log(selectedCategories.every((category) => category.budget > 0))
    setState((state) => ({
      ...state,
      formValid:
        state.name !== '' &&
        state.budget > 0 &&
        state.startDate !== '' &&
        state.startDate <= state.endDate &&
        state.endDate !== '' &&
        selectedCategories.length > 0 &&
        selectedCategories.every((category) => category.budget > 0)
    }))
  }, [selectedCategories])

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

    setState((state) => ({
      ...state,
      categories: selectedCategories.map((category) => {
        return {
          categoryId: category.id,
          budget: parseFloat(category.budget)
        }
      })
    }))

    console.log(state)
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

  const categories = [
    { id: 1, name: 'Food', description: 'Food' },
    { id: 2, name: 'Transport', description: 'Transport' },
    { id: 3, name: 'Health', description: 'Health' },
  ]

  return (
    <>
    <div className="container-app">
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

          <div className='d-flex-left categories'>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={categories}
              value={selectedCategory}
              sx={{ width: 300, marginBottom: '2%', marginTop: '2%', marginRight: '2%' }}
              getOptionLabel={(option) => option.name}
              onChange={(e, value) => setSelectedCategory(value)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Categories"/>}
              renderOption={(props, option) => (
                <>
                  <li {...props} style={{ backgroundColor: 'white', color: 'black' }} key={option.id}>
                    {option.name}
                  </li>
                </>
              )}
            />

            <Fab
              size="small"
              color="secondary"
              className='button-new'
              disabled={selectedCategory === null}
              onClick={() => {
                const categoryExists = selectedCategories.find((item) => item.id === selectedCategory.id)

                if (categoryExists) {
                  return
                }

                setSelectedCategories((selectedCategories) => [...selectedCategories, selectedCategory])
                setSelectedCategory(null)
              }}
            >
              <AddIcon />
            </Fab>
          </div>

          <div className='categories-list'>
            <Table>
              <TableBody>
              {selectedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell sx={{width: '10%'}}>
                    {category.name}
                  </TableCell>
                  <TableCell sx={{width: '10%'}}>
                    <TextField
                      sx={{ m: 1, width: '25ch' }}
                      margin="dense"
                      id="name"
                      label="Budget (R$)"
                      type="text"
                      value={category.budget}
                      variant="outlined"
                      helperText={category.budget <= 0 ? 'This field is required' : ''}
                      color={category.budget <= 0 ? 'secondary' : 'success'}
                      disabled={state.loading}
                      required
                      inputProps={{min: 0, style: { textAlign: 'right' }}}
                    />
                  </TableCell>
                  <TableCell sx={{width: '10%'}}>
                    <Fab
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedCategories((selectedCategories) => selectedCategories.filter((item) => item.id !== category.id))
                        validate()
                      }}
                    >
                      <DeleteIcon />
                    </Fab>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardActions className='d-flex-right card-footer'>
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