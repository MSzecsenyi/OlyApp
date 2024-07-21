import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { router } from "expo-router";
import semaphoreInstance from "@/utils/Semaphore";

// Define a generic API function type
type ApiFunction<T> = (
  config?: AxiosRequestConfig
) => Promise<AxiosResponse<T>>;

// Semaphore instance for managing concurrency
const semaphore = semaphoreInstance;

interface UseApiCallProps<T> {
  apiFunction: ApiFunction<T>;
  configData?: AxiosRequestConfig; // Optional additional config
}

// Custom hook to handle API calls
export const useApiCall = <T,>({
  apiFunction,
  configData,
}: UseApiCallProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Function to fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      await semaphore.acquire();
      const defaultConfig: AxiosRequestConfig = {
        headers: {
          "user-agent": "OlympusCameraKit",
        },
      };

      // Merge default config with provided configData
      const finalConfig = { ...defaultConfig, ...configData };
      const response = await apiFunction(finalConfig);
      setData(response.data);
    } catch (error) {
      console.log("Error occurred:", error);
      setError(true);
      router.navigate("/noConnectionScreen");
    } finally {
      semaphore.release();
      setLoading(false);
    }
  };

  // Fetch data automatically when the hook is used
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, fetchData };
};
