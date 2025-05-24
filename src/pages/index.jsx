

// import { useEffect } from 'react'
// import { useRouter } from 'next/router'

// export default function Home() {
//   const router = useRouter()

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       // router.replace('/user')
//       router.replace('/admin')
//     } else {
//       router.replace('/login')
//     }
//   }, [])

//   return null
// }

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">로딩 중...</p>
    </div>
  )
}
