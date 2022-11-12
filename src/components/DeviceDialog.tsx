import { Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, Stack, TextField } from "@mui/material";
import { deviceTypes } from "constants/constants";
import { DeviceDto } from "dtos";
import { useUtils } from "hooks";
import { useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import { deviceRepository } from "repository";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  refresh: () => void;
  selectDevice: DeviceDto;
}

type GridItemProps = {
  label: string;
}

export const DialogModal = ({ handleClose, selectDevice, open, refresh }: DialogProps) => {

  const [device, setDevice] = useState<DeviceDto>(selectDevice);
  const { enqueueSnackbar } = useSnackbar();
  const { isMobile } = useUtils();
  const { add, update } = deviceRepository;

  useEffect(() => {
    setDevice(selectDevice)
  }, [selectDevice])
  
  const onChange = (e: any) => {
    setDevice(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    addDevice()
    .then(() =>{
      enqueueSnackbar(
        device.id.length > 0 ? 'Device updated' : 'Device Added', 
        { variant: 'success' }
      );
      refresh();
      handleClose();
    })
    .finally(() => refresh)
  }

  const GridItem = ({ label }: GridItemProps) => {return (
    <Grid item hidden={isMobile} md={5}>
      <InputLabel>{label} *</InputLabel>
    </Grid>
  )}

  const addDevice = async () => {
    if (device.id.length > 0)
      return await update(device);
    return await add(device);
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
      <DialogTitle>{device.id.length > 0 ? 'Update device' : 'Add device'}</DialogTitle>
      <DialogContent>
        <Stack 
          mt={1}
          component='form'
          onSubmit={handleSubmit}
          spacing={4}
        >
          <Grid 
            container
            direction='row'
            alignItems='center'
            justifyContent='center'
          >
            <GridItem label='System Name'/>
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                required
                label={isMobile ? 'System Name' : ''}
                size='small'
                name='system_name'
                value={device.system_name}
                onChange={onChange}
                />
            </Grid>
          </Grid>
          <Grid
            container
            direction='row'
            alignItems='center'
            justifyContent='center'
          >
            <GridItem label='Type'/>
            <Grid item xs={12} md={7}>
              <FormControl required fullWidth>
                { isMobile && <InputLabel>Type</InputLabel> }
                <Select
                  label={isMobile ? 'Type' : ''}
                  size='small'
                  name='type'
                  value={device.type}
                  onChange={onChange}
                >
                  {
                    deviceTypes.filter(x => x !== deviceTypes[0]).map(type =>
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            direction='row'
            alignItems='center'
            justifyContent='center'
          >
            <GridItem label='HDD Capacity (GB)'/>
            <Grid item xs={12} md={7}>
              <TextField
                required
                size='small'
                type='number'
                label={isMobile ? 'HDD Capacity (GB)' : ''}
                name='hdd_capacity'
                fullWidth
                value={device.hdd_capacity}
                onChange={onChange}
              />
            </Grid>
          </Grid>
          <Stack spacing={1}>
            <Button
              type='submit'
              variant='contained'
              fullWidth
            >{device.id.length > 0 ? 'Update' : 'Save'}
            </Button>
            <Button
              onClick={handleClose}
              color='error'
            >Cancel</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
