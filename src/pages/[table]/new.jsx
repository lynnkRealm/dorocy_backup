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
, 'principal_type', 'principal_id'
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

const getNow = () => new Date().toISOString().replace('T', ' ').replace('Z', '')

export default function DynamicEditPage() {
  const router = useRouter()
  const { table } = router.query
  const [formData, setFormData] = useState({})

  const tableName = Array.isArray(table) ? table[0] : table
  const allColumns = tableName && ALL_COLUMNS_BY_TABLE[tableName] ? ALL_COLUMNS_BY_TABLE[tableName] : []
  const primaryKey = `${tableName}_id`
  const visibleColumns = allColumns.filter(col => col !== primaryKey)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const now = getNow()
    const payload = {
      ...formData,
      created_at: now,
      updated_at: now,
    }
    try {
      await crudRequest({ table: tableName, action: 'create', data: payload })
      alert('등록 성공')
      router.push(`/${tableName}`)
    } catch (err) {
      alert('등록 실패')
      console.error(err)
    }
  }

  if (!tableName) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{tableName.toUpperCase()} 전체 필드 등록</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {visibleColumns.map((key) => (
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