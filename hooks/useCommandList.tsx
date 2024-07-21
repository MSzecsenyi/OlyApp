import { useApiCall } from "./useApiCall";
import axios, { AxiosResponse } from "axios";

const getCommandList = async (): Promise<AxiosResponse<string>> => {
  return await axios.get("http://192.168.0.10/get_commandlist.cgi");
};

export const useCommandList = () => {
  return useApiCall<string>({ apiFunction: getCommandList });
};
