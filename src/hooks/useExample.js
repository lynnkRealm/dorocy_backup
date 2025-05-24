import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

const fetchExample = async () => {
  const res = await axiosInstance.get('/example');
  return res.data;
};

export const useExample = () => useQuery({ queryKey: ['example'], queryFn: fetchExample });
