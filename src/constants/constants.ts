import { DeviceDto } from "dtos";

export const deviceTypes = ['ALL', 'MAC', 'WINDOWS_SERVER', 'WINDOWS_WORKSTATION'];

export const INITIAL_DEVICE_STATE: DeviceDto = {
  id: "",
  system_name: "",
  type: deviceTypes[1],
  hdd_capacity: 0
}