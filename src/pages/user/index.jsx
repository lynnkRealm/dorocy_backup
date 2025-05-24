import { useEffect, useState } from 'react'
import Link from 'next/link'
import { crudRequest } from '@/api/crud'

export default function UserListPage() {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    const res = await crudRequest({ table: 'user', action: 'read' })
    console.log('[유저 응답]', res)
    setUsers(res)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    const ok = confirm('정말 삭제할까요?')
    if (!ok) return

    try {
      await crudRequest({
        table: 'user',
        action: 'delete',
        filter: { user_id: id }
      })
      alert('삭제 완료')
      fetchUsers() // 삭제 후 목록 갱신
    } catch (err) {
      console.error('[삭제 실패]', err)
      alert('삭제 실패')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">사용자 목록</h2>
        <Link href="/user/new" className="bg-black text-white px-4 py-2 rounded">+ 사용자 등록</Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">이름</th>
            <th className="p-2 border">이메일</th>
            <th className="p-2 border">액션</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((u) => (
            <tr key={u.user_id}>
              <td className="p-2 border">{u.user_id}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border space-x-2">
                <Link href={`/user/${u.user_id}`} className="text-blue-500">수정</Link>
                <button onClick={() => handleDelete(u.user_id)} className="text-red-500">
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
