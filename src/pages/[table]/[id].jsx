import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { crudRequest } from '@/api/crud'

export default function DynamicEditPage() {
  const router = useRouter()
  const { table, id } = router.query
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!table || !id) return
    const fetchItem = async () => {
      try {
        const res = await crudRequest({
          table,
          action: 'read',
          filter: { [`${table}_id`]: Number(id) },
        })
        if (res.length > 0) {
          setFormData(res[0])
        }
      } catch (err) {
        alert('데이터 로드 실패')
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [table, id])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await crudRequest({
        table,
        action: 'update',
        filter: { [`${table}_id`]: Number(id) },
        data: formData,
      })
      alert('수정 성공')
      router.push(`/${table}`)
    } catch (err) {
      alert('수정 실패')
      console.error(err)
    }
  }

  if (loading) return <div>로딩 중...</div>
  if (!table || !id) return <div>잘못된 접근입니다.</div>

  const fields = Object.keys(formData)

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{table.toUpperCase()} 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <label className="block mb-1 font-semibold">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field] ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={field === `${table}_id`} // PK는 수정 불가
            />
          </div>
        ))}
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          저장
        </button>
      </form>
    </div>
  )
}
