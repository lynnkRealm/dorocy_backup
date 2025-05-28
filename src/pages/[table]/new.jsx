import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { crudRequest } from '@/api/crud'
import styles from '../../styles/scss/DynamicForm.module.scss'

export default function DynamicEditPage() {
  const router = useRouter()
  const { table } = router.query
  const [allColumns, setAllColumns] = useState([])
  const [formData, setFormData] = useState({})

  useEffect(() => {
  const fetchColumns = async () => {
    const normalizedTable = Array.isArray(table) ? table[0] : table;
    if (!router.isReady || !normalizedTable) return;

    try {
      const res = await crudRequest({
        table: normalizedTable,
        action: 'read',
        filter: {},
      })

      console.log('[DEBUG] table:', normalizedTable)
      console.log('[DEBUG] res.data:', res.data)

      if (res.data && res.data.length > 0 && res.data[0]) {
        setAllColumns(Object.keys(res.data[0]))
      } else {
        alert(`🚨 ${normalizedTable} 테이블에서 컬럼 추론 실패: 데이터 없음 혹은 1건 이상에 null`)
      }
    } catch (err) {
      console.error('❌ 컬럼 fetch 실패:', err)
    }
  }

  fetchColumns()
}, [router.isReady, table])



  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const filledData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== '' && v !== undefined)
    )
    try {
      await crudRequest({
        table,
        action: 'create',
        data: filledData,
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
    <div className={styles.container}>
      <h1 className={styles.title}>{table.toUpperCase()} 전체 필드 등록</h1>
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
