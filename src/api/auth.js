import axios from 'axios'
import axiosInstance from './axiosInstance'

export const loginAdmin = async ({ id, pw }) => {
  const res = await axiosInstance.post('/auth/login', { id, pw })
  return res.data
}

export const RegstUser = async ({email,password,name,utype }) => {
    const res = await axiosInstance.post('/auth/register' , {email,password,name,utype})
    return res.data
}