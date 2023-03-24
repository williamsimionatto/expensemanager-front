import { Alert, AlertTitle, Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogTitle, TextField } from "@mui/material"
import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RemoteCategoryResultModel } from "../../../domain/model"
import { DeletePeriodCategory, EditPeriod, LoadCategories, LoadPeriodById } from "../../../domain/usecase"
import { NotficationToaster, NotificationParams } from "../../components/notification"
import MasterDetail from "../add-period/components/MasterDetail"
import { LoadingButton } from "@mui/lab"
import SaveIcon from '@mui/icons-material/Save';

type Props = {
  editPeriod: EditPeriod
  loadPeriodById: LoadPeriodById
  loadCategories: LoadCategories
  deletePeriodCategory: DeletePeriodCategory
}

type State = EditPeriod.Params & {
  id: string
  loading: boolean
  formValid: boolean
  notification: {
    message: string
    type: 'success' | 'error'
    open: boolean
  }
}

const EditPeriodForm: React.FC<Props> = ({ editPeriod, loadPeriodById, loadCategories, deletePeriodCategory } : Props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = React.useState<RemoteCategoryResultModel[]>([]);
  const [hasBudgetError, setHasBudgetError] = React.useState(false);
  const [showDialogConfirmation, setShowDialogConfirmation] = React.useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = React.useState<Number | undefined>(undefined);

  const [state, setState] = React.useState<State>({
    id: params.periodId ?? '',
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

    loadPeriodById
      .loadById(state.id)
      .then((period) => {
        setState((old) => ({
          ...old,
          id: `${period.id}`,
          name: period.name,
          startDate: new Date((period.startDate)).toLocaleDateString('en-CA', { timeZone: 'Europe/Andorra' }),
          endDate: new Date((period.endDate)).toLocaleDateString('en-CA', { timeZone: 'Europe/Andorra' }),
          budget: period.budget,
          categories: period.categories
        }))
      })
  }, [loadCategories, loadPeriodById, state.id])

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
    setShowDialogConfirmation(true)
    setDeleteCategoryId(id)
  }

  const handleConfirmRemoveCategory = async () => {
    await deletePeriodCategory
      .delete(state.id, deleteCategoryId?.toString() ?? '0')
      .then(() => {
        setState((state) => ({
          ...state,
          categories: state.categories.filter((c) => c.category.id !== deleteCategoryId)
        }))
      }).catch((error) => {
        setState((state) => ({
          ...state,
          notification: {
            message: error.message,
            type: 'error',
            open: true
          }
        }))
      })

    setShowDialogConfirmation(false)
    setDeleteCategoryId(undefined)
  }

  const handleAddCategory = (data: EditPeriod.RemoteEditPeriodCategory) => {
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

    const { id, name, startDate, endDate, budget, categories } = state

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

    await editPeriod.edit(id, {
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
        message: 'Period updated successfully',
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

        <Dialog
          open={showDialogConfirmation}
          onClose={() => {
            setState((state) => ({
              ...state,
              openDialog: false
            }))
          }}
        >
          <DialogTitle>
            This action will delete all expenses linked to this category. Do you wish to continue? 
          </DialogTitle>

          <DialogActions>
            <Button
              onClick={() => {
                setShowDialogConfirmation(false)
              }}
              className="button-cancel"
              variant='outlined'
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmRemoveCategory()}
              color="secondary"
              variant="contained"
              className="button-new"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Card>
          <CardHeader title="Edit Period" className="card-header" />

          <CardContent style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <form>
              <TextField
                sx={{ m: 1, width: '25ch' }}
                margin="dense"
                id="id"
                label="Code"
                type="text"
                value={state.id}
                variant="outlined"
                disabled={true}
              />

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

              <TextField
                sx={{ m: 1, width: '25ch' }}
                margin="dense"
                id="startDate"
                label="Start Date"
                type="text"
                value={state.startDate}
                variant="outlined"
                color={state.startDate === '' ? 'secondary' : 'success'}
                disabled={true}
              />

              <TextField
                sx={{ m: 1, width: '25ch' }}
                margin="dense"
                id="endDate"
                label="End Date"
                type="text"
                value={state.endDate}
                variant="outlined"
                color={state.endDate === '' ? 'secondary' : 'success'}
                disabled={true}
              />

              <MasterDetail
                title='Categories'
                data={state.categories}
                onAdd={handleAddCategory}
                onRemoveCategory={handleRemoveCategory}
                categories={categories}
              />
            </form>
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

export default EditPeriodForm
