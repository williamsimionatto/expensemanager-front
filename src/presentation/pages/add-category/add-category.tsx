import { LoadingButton } from '@mui/lab';
import { Button, Card, CardActions, CardContent, CardHeader, TextField } from '@mui/material';
import * as React from 'react';
import { AddCategory } from '../../../domain/usecase';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom";

import './style/add-category.css'
import { NotficationToaster, NotificationParams } from '../../components/notification';

type Props = {
  addCategory: AddCategory
}

type State = AddCategory.Params & {
  loading: boolean
  formValid: boolean
  notification: {
    message: string
    type: 'success' | 'error'
    open: boolean
  }
}

const AddCategoryForm: React.FC<Props> = ( {addCategory}: Props ) => {
  const navigate = useNavigate();
  const [state, setState] = React.useState<State>({
    name: '',
    description: '',
    loading: false,
    formValid: false,
    notification: {
      message: '',
      type: 'success',
      open: false,
    }
  })

  const validate = React.useCallback(() => {
    setState((state) => ({
      ...state,
      formValid: state.name !== '' && state.description !== ''
    }))
  }, [])

  const handleRedirect = (route: string, notification?: NotificationParams) => {
    navigate(route, {
      replace: true,
      state: {
        notification
      }
    })
  }

  const handleSubmit = async () => {
    setState((state) => ({
      ...state,
      loading: true
    }))

    await addCategory
      .add(state)
      .then(() => {
        setState((state) => ({
          ...state,
          loading: false
        }))

        handleRedirect('/categories', {
          message: 'Category added successfully',
          type: 'success',
          open: true
        })
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
          <CardHeader title="Add Category" className="card-header" />

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

export default AddCategoryForm;