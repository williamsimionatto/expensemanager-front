import * as React from 'react';
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type NotificationParams = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  open: boolean;
}

export const NotficationToaster = (
  props: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    open: boolean;
    setOpen: () => void;
  }
) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen();
  };

  return (
    <Snackbar 
      open={props.open} 
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={props.type} sx={{ width: '100%' }}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}