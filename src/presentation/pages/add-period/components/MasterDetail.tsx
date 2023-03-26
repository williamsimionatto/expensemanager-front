import React from "react";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { RemoteCategoryResultModel } from '../../../../domain/model';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddPeriod } from "../../../../domain/usecase";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './MasterDetail.css'

type Props = {
  title: string
  data: AddPeriod.RemoteAddPeriodCategory[]
  categories: RemoteCategoryResultModel[]
  onAdd: (category: AddPeriod.RemoteAddPeriodCategory) => void
  onRemoveCategory: (categoryId: number, remote: boolean) => void
}

const MasterDetail: React.FC<Props> = (props: Props) => {
  const [category, setCategory] = React.useState<AddPeriod.RemoteAddPeriodCategory>({
    category: {
      id: 0,
      name: '',
      description: '',
    },
    budget: 0
  })
  const [openModal, setOpenModal] = React.useState(false)
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<RemoteCategoryResultModel | null>(null)

  const handleAddCategory = () => {
    const params = {
      category: selectedCategory,
      budget: category?.budget ?? 0
    }

    props.onAdd(params as AddPeriod.RemoteAddPeriodCategory)
    setOpenModal(false)
    setSelectedCategory(null)
    setIsFormValid(false)
    resetCategory()
  }

  const resetCategory = () => {
    setCategory({
      category: {
        id: 0,
        name: '',
        description: '',
      },
      budget: 0
    })
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

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

    setCategory((old) => ({
      ...old as AddPeriod.RemoteAddPeriodCategory,
      [field]: value
    }))

    validate();
  }

  React.useEffect(() => {
    validate()
  })

  const validate = () => {
    setIsFormValid(
      selectedCategory !== null &&
      category?.budget > 0
    )
  }

  const handleEditCategory = (category: AddPeriod.RemoteAddPeriodCategory) => {
    setCategory(category)
    setSelectedCategory(category.category)
    setOpenModal(true)
    validate()
  }

  return (
    <>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Category to Period</DialogTitle>
        <DialogContent
          className="d-flex"
        >
          <Autocomplete
            disablePortal={false}
            id="categories_select"
            options={props.categories}
            value={selectedCategory}
            sx={{ width: 300, marginTop: '1%' , marginRight: '3%' }}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => {
              setSelectedCategory(value)
              validate()
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Categories"/>}
          />

          <TextField
            sx={{ width: '30ch' }}
            margin="dense"
            id="budget"
            label="Budget (R$)"
            value={category?.budget}
            type="text"
            onChange={(e) => handleChanges(e, 'budget')}
            variant="outlined"
            helperText={(category?.budget ?? 0) <= 0 ? 'This field is required' : ''}
            color={(category?.budget ?? 0) <= 0 ? 'secondary' : 'success'}
            required
            inputProps={{min: 0, style: { textAlign: 'right' }}}
          />
        </DialogContent>

        <DialogActions>
          <Button
            color="secondary"
            onClick={() => setOpenModal(false)}
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
            onClick={handleAddCategory}
            disabled={!isFormValid}
          >
            <span className='button-label'>Add</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <div className='master-detail'>
        <div className="master-detail-content">
          <div className="master-detail-header">
            <div className="master-detail-title">
              <span>{props.title}</span>
            </div>

            <div className='master-detail-info'>
              <IconButton 
                size='small'
                style={{
                  color: '#fff'
                }}
                onClick={() => handleOpenModal()}
              >
                <AddCircleOutlineIcon/>
              </IconButton>
            </div>
          </div>

          <div className="master-detail-body">
            <Table 
              className='table'
              border={1}
            >
              <TableHead>
                <TableRow>
                  <TableCell className='column'>Name</TableCell>
                  <TableCell className='column'>Budget</TableCell>
                  <TableCell className='column' align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  props.data.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className='column'>{data.category.name}</TableCell>
                      <TableCell className='column' width={150}>
                        {formatCurrency(Number(data.budget))}
                      </TableCell>
                      <TableCell 
                        className='column' 
                        width={150}
                        align='center'
                      >
                        <Fab
                          size="small"
                          style={{ marginRight: '5px' }}
                          onClick={() => handleEditCategory(data)}
                        >
                          <EditIcon 
                            htmlColor='#9d5bff'
                            fontSize='small'
                          />
                        </Fab>

                        <Fab
                          size="small"
                          onClick={() => props.onRemoveCategory(data.category.id, data.id !== undefined)}
                        >
                          <DeleteIcon 
                            htmlColor='red'
                            fontSize='small'
                          />
                        </Fab>

                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}

export default MasterDetail
