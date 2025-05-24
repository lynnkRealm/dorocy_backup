import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Link from "next/link"
import { crudRequest } from "@/api/crud"
import styles from "../../styles/scss/TableList.module.scss";

const tableColumns = {
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

function parsePoint(pointStr) {
  if (!pointStr) return "";
  // POINT(127.1234 37.5678) -> "127.1234, 37.5678"
  const match = pointStr.match(/^POINT\(([-\d.]+) ([-\d.]+)\)$/);
  if (!match) return pointStr; // 형식 안 맞으면 원본 반환
  return `(${match[1]}, ${match[2]})`;
}


export default function TableListPage() {
  const router = useRouter()
  const { table } = router.query
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!table) return
    const fetchItems = async () => {
      try {
        const res = await crudRequest({ table, action: "read" })
        setItems(res)
      } catch (err) {
        alert("데이터 로딩 실패")
      }
    }
    fetchItems()
  }, [table])

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    try {
      await crudRequest({ table, action: "delete", filter: { [`${table}_id`]: id } })
      setItems((prev) => prev.filter((item) => item[`${table}_id`] !== id))
    } catch (err) {
      alert("삭제 실패")
    }
  }

  if (!table) return <div>Loading...</div>

  // 컬럼이 정의 안 된 테이블이면 모든 키를 다 보여주기 (fallback)
  const columns = tableColumns[table] || (items[0] ? Object.keys(items[0]).map((k) => ({ key: k, label: k })) : [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{table.replace(/_/g, " ").toUpperCase()} 목록</h1>
        <Link href={`/${table}/new`} className={styles.addButton}>
          + 새 항목 등록
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(({ key, label }) => (
              <th key={key} className={styles.th}>
                {label}
              </th>
            ))}
            <th className={styles.thAction}>액션</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item[`${table}_id`]} className={styles.tr}>
                {columns.map(({ key }) => (
                  <td key={key} className={styles.td}>
                    {["start_loc", "end_loc", "path_loc", "loc"].includes(key)
                      ? parsePoint(String(item[key]))
                      : String(item[key])}
                  </td>
                ))}
                <td className={styles.tdActions}>
                  <Link href={`/${table}/${item[`${table}_id`]}`} className={styles.editBtn}>
                    수정
                  </Link>
                  <button onClick={() => handleDelete(item[`${table}_id`])} className={styles.deleteBtn}>
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className={styles.empty}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
