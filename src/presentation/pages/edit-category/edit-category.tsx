import { LoadingButton } from "@mui/lab"
import { Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material"
import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { EditCategory, LoadCategoryById } from "../../../domain/usecase"
import { NotficationToaster, NotificationParams } from "../../components/notification"
import SaveIcon from '@mui/icons-material/Save';

type Props = {
  editCategory: EditCategory
  loadCategoryById: LoadCategoryById
}

type State = EditCategory.Params & {
  id: string
  loading: boolean
  formValid: boolean
  notification: {
    message: string
    type: 'success' | 'error'
    open: boolean
  }
}

const EditCategoryForm: React.FC<Props> = ({ editCategory, loadCategoryById }: Props) => {
  const navigate = useNavigate();
  const params = useParams()

  const [state, setState] = React.useState<State>({
    id: params.categoryId ?? '',
    name: '',
    description: '',
    loading: false,
    formValid: false,
    notification: {
      message: '',
      type: 'success',
      open: false
    }
  })

  const validate = React.useCallback(() => {
    setState((state) => ({
      ...state,
      formValid: state.name !== '' && state.description !== ''
    }))
  }, [])

  React.useEffect(() => {
    loadCategoryById
      .loadById(state.id)
      .then((category) => {
        setState((old) => ({
          ...old,
          id: `${category.id}`,
          name: category.name,
          description: category.description
        }))
      })
      .catch((error) => {
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

    validate()
  }, [loadCategoryById, validate, state.id])

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
    setState((state) => ({
      ...state,
      [field]: e.target.value
    }))

    validate();
  }

  const handleSubmit = async () => {
    setState((state) => ({
      ...state,
      loading: true
    }))

    const { name, description } = state

    await editCategory
      .edit(state.id, {
        name,
        description
      })
      .then(() => {
        setState((state) => ({
          ...state,
          loading: false
        }))

        handleRedirect('/categories', {
          message: 'Category updated successfully',
          type: 'success',
          open: true
        })
      })
      .catch((error) => {
        setState((state) => ({
          ...state,
          loading: false
        }))

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
        
      <div className="container-app">
        <Card>
          <CardHeader title="Edit Category" className="card-header" />

          <CardContent>
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
                sx={{ m: 1, width: '75ch' }}
                margin="dense"
                id="description"
                label="Description"
                type="text"
                value={state.description}
                onChange={(e) => handleChanges(e, 'description')}
                variant="outlined"
                helperText={state.description === '' ? 'This field is required' : ''}
                color={state.description === '' ? 'secondary' : 'success'}
                disabled={state.loading}
                required
              />
            </form>
          </CardContent>

          <CardActions className='d-flex-right'>
            <Button
              color="secondary"
              onClick={() => handleRedirect('/categories')}
              className="button-cancel"
              variant='outlined'
            >
              <span className='button-label'>Cancel</span>
            </Button>

            <LoadingButton
              onClick={handleSubmit}
              color="secondary"
              loading={state.loading}
              loadingPosition="end"
              endIcon={<SaveIcon className='icon'/>}
              variant="contained"
              disabled={!state.formValid}
              className="button-new"
            >
              <span className='button-label'>Save</span>
            </LoadingButton>
          </CardActions>
        </Card>
      </div>
    </>
  )
}

export default EditCategoryForm
