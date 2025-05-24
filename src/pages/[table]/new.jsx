import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { crudRequest } from '@/api/crud'

export default function DynamicCreatePage() {
  const router = useRouter()
  const { table } = router.query
  const [formData, setFormData] = useState({})

  // 간단히 필드명만 미리 세팅 (필요시 API로 컬럼명 동적 로딩 추천)
  const fields = Object.keys(formData).length > 0 ? Object.keys(formData) : []

  useEffect(() => {
    if (!table) return
    // 기본 빈 폼데이터 세팅 - 실제 서비스에선 스키마 API로 대체 가능
    setFormData({})
  }, [table])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await crudRequest({
        table,
        action: 'create',
        data: formData,
      })
      alert('등록 성공')
      router.push(`/${table}`)
    } catch (err) {
      alert('등록 실패')
      console.error(err)
    }
  }

  if (!table) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{table.toUpperCase()} 새 항목 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(fields.length > 0 ? fields : ["name", "email"]).map((field) => (
          <div key={field}>
            <label className="block mb-1 font-semibold">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          등록
        </button>
      </form>
    </div>
  )
}
