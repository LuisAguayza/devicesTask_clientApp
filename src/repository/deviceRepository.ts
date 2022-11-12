import axios from "axios";
import { DeviceDto } from "dtos";

const REQUEST_URL = 'http://localhost:3000'

export const deviceRepository = {
  get: async() => {
    return await axios.get<DeviceDto[]>(`${REQUEST_URL}/devices`);
  },
  remove: async (id: string) => {
    return await axios.delete<DeviceDto>(`${REQUEST_URL}/devices/${id}`);
  },
  add: async(data: DeviceDto) => {
    const { hdd_capacity, system_name, type } = data;
    const body = { hdd_capacity, system_name, type };
    return await axios.post<DeviceDto>(`${REQUEST_URL}/devices`, body);
  }, 
  update: async(data: DeviceDto) => {
    const { hdd_capacity, system_name, type } = data;
    const body = { hdd_capacity, system_name, type };
    return await axios.put<DeviceDto>(`${REQUEST_URL}/devices/${data.id}`, body);
  }, 
}