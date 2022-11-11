import { DeviceDto } from "dtos";

export const sortByName = (devicesList: DeviceDto[]) => {
  return devicesList.sort((a, b) => 
    a.system_name.toLowerCase() < b.system_name.toLowerCase() 
    ? -1 
    : a.system_name.toLowerCase() > b.system_name.toLowerCase() 
      ? 1 : 0
  );
}

export const sortByCapacity = (devicesList: DeviceDto[]) => devicesList.sort((a, b) => a.hdd_capacity - b.hdd_capacity);