import axios from 'axios'
import axiosInstance from './axiosInstance'

export const loginAdmin = async ({ id, pw }) => {
  const res = await axiosInstance.post('/auth/login', { id, pw })
  return res.data
}

export const RegstUser = async ({id,pw,type }) => {
    const res = await axiosInstance.post('/auth/register' , {id,pw,name,type})
    return res.data
}