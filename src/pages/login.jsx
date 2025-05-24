import { useRouter } from 'next/router'
import { useState } from 'react'
import axios from 'axios'
import axiosInstance from '@/api/axiosInstance'
import styles from '../styles/scss/Login.module.scss'

export default function LoginPage() {
  console.log('📡 baseURL:', axiosInstance.defaults.baseURL)
  const router = useRouter()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  const handleLogin = async (e) => {
  e.preventDefault()
  console.log('🚀 handleLogin called')

  const payload = {
    email: id,
    password: pw,
    type: 'ADMIN',
  }

  console.log('📤 payload:', payload)

  try {
    const { data } = await axiosInstance.post(
      '/auth/login',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    console.log('✅ login success:', data)
    localStorage.setItem('token', data.access_token)
    router.replace('/user')
  } catch (err) {
    console.error('❌ login error:', err)
    alert('로그인 실패')
  }
}


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>관리자 로그인</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          name="id"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className={styles.input}
          required
          autoComplete="username"
        />
        <input
          type="password"
          name="pw"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className={styles.input}
          required
          autoComplete="current-password"
        />
        <button type="submit" className={styles.button}>로그인</button>
      </form>
    </div>
  )
}
