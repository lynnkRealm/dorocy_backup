import axiosInstance from "./axiosInstance"

// src/api/crud.js
export const crudRequest = async ({ table, action, data = null, filter = null }) => {
  try {
    console.log('[CRUD 요청]', { table, action, data, filter })
    const res = await axiosInstance.post('/crud/admin', { table, action, data, filter })
    console.log('[CRUD 응답]', res.data)
    return res.data.data ?? []
  } catch (err) {
    console.error('[CRUD 실패]', err)
    return []
  }
}
