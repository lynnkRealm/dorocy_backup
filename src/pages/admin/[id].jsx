import { crudRequest } from '@/api/crud'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function EditAdmin() {
  const router = useRouter()
  const { id } = router.query
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')  // ← 비번도 같이 보여줄 거면

  useEffect(() => {
    if (!id) return  // id 없을 때는 실행 안 함
    const fetchAdmin = async () => {
      const Admins = await crudRequest({ table: 'admin', action: 'read', filter: { admin_id: Number(id) } })
      const target = Admins[0]
      if (target) {
        setName(target.name)
        setEmail(target.email)
        setPassword(target.password)  // ← 비번 해시가 필요하면
      }
    }
    fetchAdmin()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await crudRequest({
      table: 'admin',
      action: 'update',
      filter: { admin_id: Number(id) },
      data: { name, email, admin_type, created_at, updated_at }
    })
    router.push('/admin')
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">사용자 수정</h2>
      <input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      {/* 비밀번호 보여줄 거면 ↓ */}
      <input
        placeholder="비밀번호"
        value={password}
        type='password'
        readOnly
        className="border p-2 w-full bg-gray-100 text-gray-500"
      />
      <button className="bg-black text-white px-4 py-2" type="submit">
        수정
      </button>
    </form>
  )
}
