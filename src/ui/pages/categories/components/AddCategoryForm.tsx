import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { NotficationToaster } from '../../../components/notification';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

export type AddCategoryParams = {
  name: string;
  description: string;
}

export type AddCategoryFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function AddCategoryForm(props: AddCategoryFormProps) {
  const [category, setCategory] = useState<AddCategoryParams>({
    name: '',
    description: '',
  });

  const [formValid, setFormValid] = useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);

  const [showNotification, setShowNotification] = useState({
    message: '',
    type: 'success',
    open: false,
  });

  const handleClose = () => {
    clearForm();
    props.setOpen(false);
  };

  const validateForm = useCallback(() => {
      setFormValid(category.name !== '' && category.description !== '');
    },
    [category],
  )

  useEffect(() => {
    validateForm();
  }, [category, validateForm]);

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      setShowNotification({
        message: 'Category added successfully',
        type: 'success',
        open: true,
      });
  
      clearForm();
      props.setOpen(false);
    }, 1500);
  };

  const clearForm = () => {
    setCategory({
      name: '',
      description: '',
    });
  }

  return (
    <>
      <NotficationToaster
        message={"Category added successfully"}
        type={"success"}
        open={showNotification.open}
        setOpen={() => setShowNotification({ ...showNotification, open: false })}
      />

      <Dialog 
        open={props.open}
        onClose={handleClose}
        disableEscapeKeyDown
      >
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <p>Register a new expense category.</p>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={category.name}
            onChange={
              (e: any) => {
                setCategory({ ...category, name: e.target.value });
              }
            }
            variant="outlined"
            helperText={category.name === '' ? 'This field is required' : ''}
            color={category.name === '' ? 'secondary' : 'success'}
            disabled={loading}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={category.description}
            onChange={
              (e: any) => {
                setCategory({ ...category, description: e.target.value });
              }
            }
            variant="outlined"
            helperText={category.description === '' ? 'This field is required' : ''}
            color={category.description === '' ? 'secondary' : 'success'}
            disabled={loading}
          />

        </DialogContent>
        <DialogActions>
          <Button 
            color="secondary"
            onClick={handleClose}>
              Cancel
          </Button>
          <LoadingButton
            color="secondary"
            onClick={handleSubmit}
            loading={loading}
            loadingPosition="end"
            endIcon={<SaveIcon />}
            variant="contained"
            disabled={!formValid}
            className="button-new"
          >
            <span>Save</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}