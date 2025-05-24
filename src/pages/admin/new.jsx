import { useState } from 'react'
import { useRouter } from 'next/router'
import { crudRequest } from '@/api/crud'
import { RegstUser } from '@/api/auth'

export default function UserCreatePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [utype,setutype] = useState('')
  const router = useRouter()
  const now = new Date();

  const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const now = new Date().toISOString().replace('T', ' ').replace('Z', '')

    await crudRequest({
      table: 'admin',
      action: 'create',
      data: {
        admin_type: utype,
        email,
        password: 'root',
        name,
        profile_img: '',
        created_at: now,
        updated_at: now,
      },
    })

    console.log('등록 성공:', { name, email })
    router.push('/admin')
  } catch (err) {
    if (err.response) {
      console.error('등록 실패:', err.response.data)
    } else {
      console.error('등록 실패:', err.message)
    }
  }
}


  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">관리자 등록</h2>
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
      <input
        placeholder="관리자 타입(ROAD,SERVICE 택1)"
        value={utype}
        onChange={(e) => setutype(e.target.value)}
        className="border p-2 w-full"
      />
      <button className="bg-black text-white px-4 py-2" type="submit">
        등록
      </button>
    </form>
  )
}
