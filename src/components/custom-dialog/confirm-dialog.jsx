import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export function ConfirmDialog({
  mode='',
  maxWidth='xs',
  open,
  title='',
  action=<> </>,
  content,
  onClose,
  ...other
}) {
  
  const contentElement = (
    <>
    <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

    {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

    <DialogActions>
      {action}

      <Button variant="outlined" color="inherit" onClick={onClose}>
        ביטול
      </Button>
    </DialogActions>
    </>
  )

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={onClose} {...other}>
     {mode === 'full' ? content : contentElement}
    </Dialog>
  );
}
