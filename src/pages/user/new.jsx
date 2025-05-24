import { useState } from 'react'
import { useRouter } from 'next/router'
import { crudRequest } from '@/api/crud'

export default function UserCreatePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 👇 이렇게 하면 됨
      await crudRequest({
        table: 'user',
        action: 'create',
        data: {
            name,
            email,
            password: 'root',
            type: 'USER'
        }
        })

      console.log('등록 성공:', { name, email })
      router.push('/user')
    } catch (err) {
      console.error('등록 실패:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">사용자 등록</h2>
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
      <button className="bg-black text-white px-4 py-2" type="submit">
        등록
      </button>
    </form>
  )
}
