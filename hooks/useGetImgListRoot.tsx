import { useApiCall } from "./useApiCall";
import axios, { AxiosResponse } from "axios";

const getImgListRoot = async (): Promise<AxiosResponse<string>> => {
  return await axios.get(
    "http://192.168.0.10/get_imglist.cgi?DIR=/DCIM/100OLYMP"
  );
};

export const useGetImageListRoot = () => {
  return useApiCall<string>({ apiFunction: getImgListRoot });
};
