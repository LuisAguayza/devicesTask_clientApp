import { Apple, Delete, DesktopWindows, Edit } from '@mui/icons-material';
import { Card, IconButton, ListItem, ListItemIcon, ListItemText, Stack, Tooltip } from "@mui/material";
import { DeviceDto } from 'dtos/deviceDto';
import { useUtils } from 'hooks';
import { useState } from 'react';
import { RemoveDeviceDialog } from './';

type Props = {
  device: DeviceDto;
  getDevices: () => void;
  handleOpenModal: (device?: DeviceDto) => void
}

export const DeviceCard = ({
  getDevices,
  handleOpenModal,
  device 
}: Props) => {

  const { id, hdd_capacity, system_name, type } = device
  const { isMobile } = useUtils();
  const [isVisible, setIsVisible] = useState(isMobile);
  const [open, setOpen] = useState(false);

  const handleShowButton = () => setIsVisible(true)
  const handleHideButton = () => setIsVisible(false);
  const showModal = () => setOpen(prev => !prev);

  return (
    <Card
      sx={{ mt: 1 }}
      onMouseOver={handleShowButton}
      onMouseLeave={handleHideButton}
    >
      <ListItem>
        <ListItemIcon>
        {
          type.includes('MAC') ? <Apple /> : <DesktopWindows/> 
        }
        </ListItemIcon>
        <ListItemText
          primary={system_name}
          secondary={
            <Stack component='span'>
              <span>{type}</span>
              <span>{hdd_capacity} Gb</span>
            </Stack>
          }
        />
        {
          (isVisible || isMobile) &&
          <Stack component='div' direction={{ md: 'row' }}>
            <Tooltip title='Remove' placement='top'>
              <IconButton onClick={showModal}>
                <Delete />
              </IconButton>  
            </Tooltip>
            <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => handleOpenModal(device)}>
                <Edit />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      </ListItem>
      <RemoveDeviceDialog
        getDevices={getDevices}
        handleClose={showModal}
        id={id}
        open={open}
      />
    </Card>
  )
}
