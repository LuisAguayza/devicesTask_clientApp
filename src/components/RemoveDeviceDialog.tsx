import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import { deviceRepository } from 'repository';

type Props = {
  open: boolean;
  id: string;
  handleClose:() => void;
  getDevices: () => void
}

export const RemoveDeviceDialog = ({ id, handleClose, getDevices,  open}: Props) => {
  
  const { remove } = deviceRepository;
  const removeDevice = () => {
    remove(id)
    .finally(getDevices);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        {'Are you sure remove this device?'}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={removeDevice} color='error' variant='contained' autoFocus>
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  )
}
