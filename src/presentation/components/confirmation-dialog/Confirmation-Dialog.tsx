import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"

export const ConfirmationDialog = (
  props: {
    message: string
    open: boolean
    handleClose: () => void
    handleConfirm: () => void
  }
) => {
  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
      >
        <DialogTitle>
          {props.message}
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={props.handleClose}
            className="button-cancel"
            variant='outlined'
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={props.handleConfirm}
            color="secondary"
            variant="contained"
            className="button-new"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
