import { useEffect, useState } from 'react'
import Link from 'next/link'
import { crudRequest } from '@/api/crud'

export default function AdminListPage() {
  const [Admins, setAdmins] = useState([])

  const fetchAdmins = async () => {
    const res = await crudRequest({ table: 'admin', action: 'read' })
    console.log('[유저 응답]', res)
    setAdmins(res)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleDelete = async (id) => {
    const ok = confirm('정말 삭제할까요?')
    if (!ok) return

    try {
      await crudRequest({
        table: 'admin',
        action: 'delete',
        filter: { admin_id: id }
      })
      alert('삭제 완료')
      fetchAdmins() // 삭제 후 목록 갱신
    } catch (err) {
      console.error('[삭제 실패]', err)
      alert('삭제 실패')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">관리자 목록</h2>
        <Link href="/admin/new" className="bg-black text-white px-4 py-2 rounded">+ 관리자 등록</Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">구분</th>
            <th className="p-2 border">이름</th>
            <th className="p-2 border">이메일</th>
            <th className="p-2 border">생성일</th>
            <th className="p-2 border">업데이트날짜</th>
            <th className="p-2 border">액션</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(Admins) && Admins.map((u) => (
            <tr key={u.Admin_id}>
              <td className="p-2 border">{u.admin_id}</td>
              <td className="p-2 border">{u.admin_type}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.created_at}</td>
              <td className="p-2 border">{u.updated_at}</td>

              <td className="p-2 border space-x-2">
                <Link href={`/admin/${u.admin_id}`} className="text-blue-500">수정</Link>
                <button onClick={() => handleDelete(u.admin_id)} className="text-red-500">
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
