import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { crudRequest } from '@/api/crud'
import styles from '../../styles/scss/DynamicForm.module.scss'

const ALL_COLUMNS_BY_TABLE = {
  user: ['user_id', 'name', 'email', 'password', 'naver_auth'],
  admin: ['admin_id', 'admin_type', 'email', 'password', 'name', 'profile_img'],
  favorite_place: ['id', 'user_id', 'loc', 'name', 'addr'],
  navigation: [
    'navigation_id', 'start_loc', 'end_loc', 'arrival_time', 'road_option',
    'total_distance', 'total_time', 'taxifare', 'tollfare', 'fuelprice',
    'principal_type', 'principal_id'
  ],
  path: ['path_id', 'navigation_id', 'path_loc', 'step_order', 'pathidx'],
  guide: ['guide_id', 'navigation_id', 'distance', 'duration', 'instructions', 'pointidx', 'step_order'],
  road_section: ['road_id', 'navigation_id', 'name', 'distance', 'speed', 'congestion', 'pointidx', 'pointcount'],
  road_info: ['route_no', 'road_no', 'route_name'],
  outbreak: ['outbreak_id', 'navigation_id', 'principal_id', 'principal_type', 'event_type', 'period', 'road_name', 'message', 'loc', 'road_no'],
  caution: ['caution_id', 'navigation_id', 'principal_id', 'principal_type', 'message', 'loc', 'route_no', 'route_name'],
  dincident: ['dincident_id', 'navigation_id', 'principal_id', 'principal_type', 'loc', 'period'],
  vsl: ['vsl_id', 'navigation_id', 'principal_id', 'principal_type', 'vsl_name', 'loc', 'registed_date', 'road_no', 'default_speed_limit', 'cur_speed_limit'],
  refresh_token: ['refresh_token_id', 'principal_type', 'principal_id', 'refresh_token', 'revoked', 'expires_at'],
}

const PRIMARY_KEY_BY_TABLE = {
  user: 'user_id',
  admin: 'admin_id',
  favorite_place: 'id',
  navigation: 'navigation_id',
  path: 'path_id',
  guide: 'guide_id',
  road_section: 'road_id',
  outbreak: 'outbreak_id',
  caution: 'caution_id',
  dincident: 'dincident_id',
  vsl: 'vsl_id',
  refresh_token: 'refresh_token_id',
  road_info: null
}

const getNow = () => new Date().toISOString().replace('T', ' ').replace('Z', '')

export default function DynamicEditPage() {
  const router = useRouter()
  const { table, id } = router.query
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)

  const tableName = Array.isArray(table) ? table[0] : table
  const allColumns = tableName && ALL_COLUMNS_BY_TABLE[tableName] ? ALL_COLUMNS_BY_TABLE[tableName] : []
  const primaryKey = PRIMARY_KEY_BY_TABLE[tableName]
  const visibleColumns = primaryKey ? allColumns.filter(col => col !== primaryKey) : allColumns

  useEffect(() => {
    if (!tableName) return
    const fetchItem = async () => {
      try {
        const res = await crudRequest({
          table: tableName,
          action: 'read',
          ...(primaryKey ? { filter: { [primaryKey]: Number(id) } } : {})
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
  }, [tableName, id])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const now = getNow()
    const payload = { ...formData, updated_at: now }
    try {
      await crudRequest({
        table: tableName,
        action: 'update',
        ...(primaryKey ? { filter: { [primaryKey]: Number(id) } } : {}),
        data: payload
      })
      alert('수정 성공')
      router.push(`/${tableName}`)
    } catch (err) {
      alert('수정 실패')
      console.error(err)
    }
  }

  if (loading) return <div>로딩 중...</div>
  if (!tableName || (!id && primaryKey)) return <div>잘못된 접근입니다.</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{tableName.toUpperCase()} 수정</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {visibleColumns.map((key) => (
          <div key={key} className={styles.field}>
            <label htmlFor={key} className={styles.label}>{key}</label>
            <input
              id={key}
              name={key}
              type="text"
              value={formData[key] ?? ''}
              onChange={handleChange}
              placeholder={key}
              className={styles.input}
              autoComplete="off"
            />
          </div>
        ))}
        <button type="submit" className={styles.submitBtn}>저장</button>
      </form>
    </div>
  )
}
