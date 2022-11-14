import { Add } from "@mui/icons-material";
import { CircularProgress, Container, Fab, FormControl, InputLabel, List, MenuItem, Select, SelectChangeEvent, Stack, Tooltip, Typography } from "@mui/material";
import { DeviceCard, DialogModal } from "components";
import { deviceTypes, INITIAL_DEVICE_STATE } from "constants/constants";
import { DeviceDto } from "dtos";
import { useCallback, useEffect, useState } from "react";
import { deviceRepository } from "repository";

const options = [
  {
    id: 0,
    label: 'System name',
  },
  {
    id: 1,
    label: 'HDD Capacity',
  }
]

const App = () => {

  const [devices, setDevices] = useState<DeviceDto[]>([]);
  const [selectDevice, setSelectDevice] = useState<DeviceDto>(INITIAL_DEVICE_STATE);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(deviceTypes[0]);
  const [sortBy, setSortBy] = useState<number>(options[0].id);
  const [loading, setLoading] = useState(true);
  const { get: all } = deviceRepository;
  
  const handleSort = useCallback((index: number) => {
    if(index === 0)
      return sortByName()
    return sortByCapacity()
  },[]);

  const getDevices = useCallback(() => {
    setLoading(true);
    all()
    .then(({ data }) => 
      setDevices(
        type === deviceTypes[0]
        ? data
        : data.filter(x => x.type === type)
    ))
    .finally(() => {
      setLoading(false);
      handleSort(sortBy);
    });
  }, [all, handleSort, sortBy, type]);
  
  useEffect(getDevices, [getDevices, type]);
  
  const filterByType = ({ target }: SelectChangeEvent<string>) => {
    setType(target.value);
  }

  const sort = ({ target }: SelectChangeEvent<string>) => {
    setSortBy(+target.value);
    handleSort(+target.value);
  }

  const sortByCapacity = () => {
    setDevices(prev => 
      prev.sort((a, b) => a.hdd_capacity - b.hdd_capacity)
    )
  };

  const sortByName = () => {
    setDevices(prev => prev.sort((a, b) => 
      a.system_name.toLowerCase() < b.system_name.toLowerCase() 
      ? -1 
      : a.system_name.toLowerCase() > b.system_name.toLowerCase() 
        ? 1 : 0
    ));
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
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
        >
          <FormControl fullWidth>
            <InputLabel>Device Type</InputLabel>
            <Select
              value={type}
              label='Device Type'
              onChange={filterByType}
              size='small'
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
              size='small'
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
          ? <CircularProgress />
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
