import { useApiCall } from "./useApiCall";
import axios, { AxiosResponse } from "axios";

const getDcfFileEnum = async (): Promise<AxiosResponse<string>> => {
  return await axios.get("http://192.168.0.10/get_dcffilenum.cgi");
};

export const useGetDcfFileEnum = () => {
  return useApiCall<string>({ apiFunction: getDcfFileEnum });
};
