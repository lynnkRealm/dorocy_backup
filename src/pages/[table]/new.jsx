import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { crudRequest } from '@/api/crud'
import styles from '../../styles/scss/DynamicForm.module.scss'

export default function DynamicCreatePage() {
  const router = useRouter()
  const { table } = router.query
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [allColumns, setAllColumns] = useState<string[]>([])

  // 컬럼 자동 추출용
  useEffect(() => {
    const fetchColumns = async () => {
      const normalizedTable = Array.isArray(table) ? table[0] : table
      if (!router.isReady || !normalizedTable) return

      try {
        const res = await crudRequest({
          table: normalizedTable,
          action: 'read',
          filter: {},
        })

        const rows = res?.data?.data
        if (Array.isArray(rows) && rows.length > 0) {
          const cols = Object.keys(rows[0])
          setAllColumns(cols)
        } else {
          console.warn('⚠️ usable row 없음')
          setAllColumns([])
        }
      } catch (err) {
        console.error('❌ 컬럼 추출 실패:', err)
        setAllColumns([])
      }
    }

    fetchColumns()
  }, [router.isReady, table])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedTable = Array.isArray(table) ? table[0] : table
    try {
      await crudRequest({
        table: normalizedTable,
        action: 'create',
        data: formData,
      })
      alert('✅ 등록 성공')
      router.push(`/${normalizedTable}`)
    } catch (err) {
      alert('❌ 등록 실패')
      console.error(err)
    }
  }

  if (!table) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{`${table}`.toUpperCase()} 전체 필드 등록</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {allColumns.map((key) => (
          <div key={key} className={styles.field}>
            <label htmlFor={key} className={styles.label}>{key}</label>
            <input
              id={key}
              name={key}
              type="text"
              value={formData[key] || ''}
              onChange={handleChange}
              placeholder={key}
              className={styles.input}
              autoComplete="off"
            />
          </div>
        ))}
        <button type="submit" className={styles.submitBtn}>등록</button>
      </form>
    </div>
  )
}
