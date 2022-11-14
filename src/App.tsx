import { Add } from "@mui/icons-material";
import { Box, Chip, CircularProgress, Container, Fab, FormControl, InputLabel, List, MenuItem, Select, SelectChangeEvent, Stack, Tooltip, Typography } from "@mui/material";
import { DeviceCard, DialogModal } from "components";
import { deviceTypes, INITIAL_DEVICE_STATE } from "constants/constants";
import { DeviceDto } from "dtos";
import { useCallback, useEffect, useState } from "react";
import { deviceRepository } from "repository";

const options = [
  {
    id: 'name',
    label: 'System name',
  },
  {
    id: 'capacity',
    label: 'HDD Capacity',
  }
];

const sortByCapacity = (devices: DeviceDto[]) => {
  return devices.sort((a, b) => a.hdd_capacity - b.hdd_capacity);
};

const sortByName = (devices: DeviceDto[]) => {
  return devices.sort((a, b) => 
    a.system_name.toLowerCase() < b.system_name.toLowerCase() 
    ? -1 
    : a.system_name.toLowerCase() > b.system_name.toLowerCase() 
      ? 1 : 0
  );
}

const App = () => {

  const [devices, setDevices] = useState<DeviceDto[]>([]);
  const [selectDevice, setSelectDevice] = useState<DeviceDto>(INITIAL_DEVICE_STATE);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string[]>([deviceTypes[0]]);
  const [sortBy, setSortBy] = useState<string>(options[0].id);
  const [loading, setLoading] = useState(true);
  const { get } = deviceRepository;
  
  const handleSort = useCallback((index: string, devices: DeviceDto[]) => {
    if(index === 'name')
      return sortByName(devices)
    return sortByCapacity(devices)
  },[]);

  const getDevices = useCallback(() => {
    setLoading(true);
    get()
    .then(({ data }) => {
      let result = handleSort(sortBy, data);
      setDevices(
        type[0] === deviceTypes[0]
        ? result
        : result.filter(x => type.includes(x.type))
    )}
     )
    .finally(() => setLoading(false));
  }, [get, handleSort, sortBy, type]);
  
  useEffect(getDevices, [getDevices, type]);
  
  const filterByType = ({ target: { value } }: SelectChangeEvent<typeof type>) => {
    if(value.length === 0 || (value.includes(deviceTypes[0]) && value.indexOf(deviceTypes[0]) !== 0))
      return setType([deviceTypes[0]]);
    
    return setType(typeof value === 'string' ? [deviceTypes[0]] : value.filter(x => x !== deviceTypes[0]));
  }

  const sort = ({ target }: SelectChangeEvent<string>) => {
    setSortBy(target.value);
  }

  const handleOpenModal = (device?: DeviceDto) => {
    setOpen(prev => !prev);
    setSelectDevice(device ? device : INITIAL_DEVICE_STATE);
  };

  const handleClose = () => {
    setOpen(prev => !prev);
  };  
  
  return (
    <Container 
      maxWidth='sm' 
      sx={{
        py: 10,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Stack sx={{ width: '100%' }} textAlign='center' spacing={3}>
        <Typography variant='h4'>Devices App</Typography>
        <Stack
          justifyContent='space-between'
          spacing={3}
        >
          <FormControl fullWidth>
            <InputLabel>Device Type</InputLabel>
            <Select
              multiple
              value={type}
              label='Device Type'
              onChange={filterByType}
              size='small'
              sx={{ minHeight: 53}}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {
                deviceTypes.map(device => 
                  <MenuItem 
                    key={device}
                    value={device}
                  >{device}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Sorty by</InputLabel>
            <Select
              value={`${sortBy}`}
              label='Sorty by'
              onChange={sort}
            >
              {
                options.map(({id, label}) => 
                  <MenuItem 
                    key={id}
                    value={id}
                  >{label}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </Stack>
        <Tooltip title='Add device'>
          <Fab sx={{ alignSelf: 'center' }} size='medium' onClick={() => handleOpenModal()}>
            <Add />
          </Fab>
        </Tooltip>
        {
          loading
          ? <CircularProgress sx={{ alignSelf: 'center' }}/>
          : devices.length > 0
            ? <List>
              {
                devices.map(device =>
                  <DeviceCard 
                    key={device.id}
                    device={device}
                    getDevices={getDevices}
                    handleOpenModal={handleOpenModal}
                  />
                )
              }  
              </List>
            : <Typography width='100%' textAlign='center'>No result</Typography>
        }
        <DialogModal handleClose={handleClose} open={open} refresh={getDevices} selectDevice={selectDevice}/>
      </Stack>
    </Container>
  );
}

export default App;
