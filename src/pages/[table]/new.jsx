import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { crudRequest } from '@/api/crud'
import styles from '../../styles/scss/DynamicForm.module.scss'

const TABLE_COLUMNS = {
  user: [
    { key: "name", label: "이름" },
    { key: "email", label: "이메일" },
    { key : "naver_auth", label: "네이버 연동"},
    { key: "created_at", label: "생성일" },
    { key: "updated_at", label: "업데이트날짜" },
  ],
  favorite_place : [
    { key: "id", label: "ID" },
    { key: "user_id", label: "User ID" },
    { key: "name", label: "장소 별칭" },
    { key: "addr", label: "주소" },
    { key: "created_at", label: "생성일일" },
    { key: "updated_at", label: "업데이트날짜" },
  ],
  navigation : [
    { key: "navigation_id", label: "Navigation ID" },
    { key: "principal_id", label: "동적 id" },
    { key: "principal_type", label: "동적 type" },
    { key: "start_loc", label: "출발지" },
    { key: "end_loc", label: "도착지" },
    { key: "road_option", label: "경로 옵션" },
    { key: "total_distance", label: "전체 거리" },
    { key: "total_time", label: "전체 소요 시간" },
    { key: "taxifare", label: "예상 비용" },
    { key: "tollfare", label: "톨게이트 비용" },
    { key: "fuelprice", label: "주유비" },
    { key: "created_at", label: "생성일" },
    { key: "updated_at", label: "업데이트날짜" },
  ],
  path : [
    { key: "path_id", label: "Path ID" },
    { key: "navigation_id", label: "Navigation ID" },
    { key: "path_loc", label: "상세 경로 위치(위도,경도)" },
    { key: "step_order", label: "상세 경로 내 순서" },
    { key: "created_at", label: "생성일" },
    { key: "updated_at", label: "업데이트날짜" },
  ],
  road_section : [
    { key: "road_id", label: "ID" },
    { key: "navigation_id", label: "Navigation ID" },
    { key: "distance", label: "거리" },
    { key: "name", label: "도로 이름" },
    { key: "congestion", label: "혼잡도" },
    { key: "created_at", label: "생성일" },
    { key: "updated_at", label: "업데이트날짜" },
  ],
  guide: [
    { key: "guide_id", label: "ID" },
    { key: "navigation_id", label: "Navigation ID" },
    { key: "instructions", label: "안내" },
    { key: "step_order", label: "상세 경로 내 순서" },
    { key: "created_at", label: "생성일" },
    { key: "updated_at", label: "업데이트날짜" },
  ],
  admin: [
  { key: "admin_id", label: "ID" },
  { key: "admin_type", label: "관리자 타입" },
  { key: "email", label: "이메일" },
  { key: "passwd", label: "비밀번호" },
  { key: "name", label: "이름" },
  { key: "created_at", label: "생성일" },
  { key: "updated_at", label: "업데이트 날짜" },
],
  outbreak: [
    { key: "outbreak_id", label: "ID" },
    { key: "navigation_id", label: "Navigation ID" },
    { key: "principal_id", label: "동적 id" },
    { key: "principal_type", label: "동적 type" },
    { key: "event_type", label: "이벤트 종류" },
    { key: "period", label: "기간" },
    { key: "road_name", label: "도로 이름" },
    { key: "message", label: "메시지" },
    { key: "loc", label: "위치 (POINT)" },
    { key: "road_no", label: "도로 번호" },
    { key: "created_at", label: "생성일" },
    { key: "updated_at", label: "업데이트 날짜" },
],
  caution: [
  { key: "caution_id", label: "ID" },
  { key: "navigation_id", label: "Navigation ID" },
  { key: "principal_id", label: "동적 id" },
  { key: "principal_type", label: "동적 type" },
  { key: "message", label: "메시지" },
  { key: "loc", label: "위치 (LINESTRING)" },
  { key: "route_no", label: "루트 번호" },
  { key: "route_name", label: "루트 이름" },
  { key: "created_at", label: "생성일" },
  { key: "updated_at", label: "업데이트 날짜" },
],
  dangerous_incident: [
  { key: "dincident_id", label: "ID" },
  { key: "navigation_id", label: "Navigation ID" },
  { key: "principal_id", label: "동적 id" },
  { key: "principal_type", label: "동적 type" },
  { key: "loc", label: "위치 (POINT)" },
  { key: "period", label: "기간" },
  { key: "updated_at", label: "업데이트 날짜" },
  { key: "created_at", label: "생성일" },
],
  vsl: [
  { key: "vsl_id", label: "ID" },
  { key: "vsl_name", label: "VSL 이름" },
  { key: "principal_id", label: "동적 id" },
  { key: "principal_type", label: "동적 type" },
  { key: "loc", label: "위치 (POINT)" },
  { key: "road_no", label: "도로 번호" },
  { key: "default_speed_limit", label: "기본 속도 제한" },
  { key: "cur_speed_limit", label: "현재 속도 제한" },
  { key: "registed_date", label: "등록 날짜" },
  { key: "principal_type", label: "주체 타입" },
  { key: "created_at", label: "생성일" },
  { key: "updated_at", label: "업데이트 날짜" },
],
  road_info: [
  { key: "route_no", label: "루트 번호" },
  { key: "road_no", label: "도로 번호" },
  { key: "route_name", label: "루트 이름" },
  { key: "created_at", label: "생성일" },
]
}

export default function DynamicEditPage() {
  const router = useRouter()
  const { table } = router.query
  const [formData, setFormData] = useState({})

  const columns = table && TABLE_COLUMNS[table] ? TABLE_COLUMNS[table] : []

  useEffect(() => {
    if (!table) return
    // 새 항목 생성일 경우 기본값 세팅 필요 시 여기서 구현
    // 예: 서버에서 기본값 가져오기 또는 빈 객체 세팅
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
 <div className={styles.container}>
      <h1 className={styles.title}>{table.toUpperCase()} 새 항목 등록</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {columns.map(({ key, label }) => (
          <div key={key} className={styles.field}>
            <label htmlFor={key} className={styles.label}>
              {label}
            </label>
            <input
              id={key}
              name={key}
              type="text"
              value={formData[key] || ''}
              onChange={handleChange}
              placeholder={label}
              className={styles.input}
              autoComplete="off"
            />
          </div>
        ))}
        <button type="submit" className={styles.submitBtn}>
          등록
        </button>
      </form>
    </div>

  )
}
