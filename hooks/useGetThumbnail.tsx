import axios, { AxiosRequestConfig } from "axios";
import { useApiCall } from "./useApiCall";

const getThumbnail = (filename: string, config?: AxiosRequestConfig) =>
  axios.get(
    `http://192.168.0.10/get_thumbnail.cgi?DIR=/DCIM/100OLYMP/${filename}`,
    {
      ...config,
      responseType: "arraybuffer", // Use arraybuffer for binary data
    }
  );

export const useGetThumbnail = (filename: string) => {
  return useApiCall<Uint8Array>({
    apiFunction: () => getThumbnail(filename),
    configData: {
      responseType: "arraybuffer",
    },
  });
};
