import { m } from 'framer-motion';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { varFade, varZoom } from 'src/components/animate';

// ----------------------------------------------------------------------

export function ConfirmDialog({
  mode='',
  maxWidth='xs',
  open,
  title='',
  action=<> </>,
  content,
  onClose,
  animate = false,
  animationType = 'fade',
  ...other
}) {
  
  // Get animation variants based on type
  const getAnimationVariants = () => {
    switch (animationType) {
      case 'zoom':
        return varZoom().in;
      case 'fadeUp':
        return varFade().inUp;
      case 'fadeDown':
        return varFade().inDown;
      case 'fadeLeft':
        return varFade().inLeft;
      case 'fadeRight':
        return varFade().inRight;
      case 'fade':
      default:
        return varFade().in;
    }
  };
  
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

  const dialogContent = mode === 'full' ? content : contentElement;

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={onClose} {...other}>
      {animate ? (
        <m.div
          variants={getAnimationVariants()}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {dialogContent}
        </m.div>
      ) : (
        dialogContent
      )}
    </Dialog>
  );
}
