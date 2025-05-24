import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { parseJwt } from '@/utils/jwt'

const TABLES_BY_TYPE = {
  ROAD: ['outbreak', 'vsl', 'dincident', 'caution', 'road_info'],
  SERVICE: ['user', 'admin', 'road_section', 'navigation', 'path', 'guide'],
  _ADMIN: ['user', 'admin'], // 필요하면 추가
}

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.replace('/login')
      return
    }

    const payload = parseJwt(token)
    const principalType = payload?.principal_type
    console.log(principalType)

    if (!principalType) {
      router.replace('/login')
      return
    }

    // 토큰의 principal_type에 따른 허용 테이블 목록 전달
    const allowedTables = TABLES_BY_TYPE[principalType] || []

    // 쿼리 또는 세션/컨텍스트로 넘기기. 간단히 쿼리로 넘긴 예시
    router.replace({
      pathname: '/dashboard',
      query: { tables: allowedTables.join(',') },
    })
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">로딩 중...</p>
    </div>
  )
}
