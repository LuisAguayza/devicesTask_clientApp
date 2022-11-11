import axios from "axios";
import { DeviceDto } from "dtos";

const REQUEST_URL = 'http://localhost:3000'

export const deviceRepository = {
  all: async () => {
    return await axios.get<DeviceDto[]>(`${REQUEST_URL}/devices`);
  },
  remove: async (id: string) => {
    return await axios.delete<DeviceDto>(`${REQUEST_URL}/devices/${id}`);
  },

}