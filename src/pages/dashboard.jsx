import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import { FaUser, FaMapMarkerAlt, FaRoute, FaRoad, FaListAlt, FaClipboardList, FaUserShield, FaExclamationTriangle, FaBell, FaSkullCrossbones, FaCar, FaInfoCircle } from "react-icons/fa";
import styles from "../styles/scss/Dashboard.module.scss";
import { parseJwt } from '@/utils/jwt';

const tables = [
  { key: "user", label: "User", icon: FaUser, color: "bg-blue-100", textColor: "text-blue-800" },
  { key: "favorite_place", label: "Favorite Place", icon: FaMapMarkerAlt, color: "bg-red-100", textColor: "text-red-800" },
  { key: "navigation", label: "Navigation", icon: FaRoute, color: "bg-green-100", textColor: "text-green-800" },
  { key: "path", label: "Path", icon: FaRoad, color: "bg-yellow-100", textColor: "text-yellow-800" },
  { key: "road_section", label: "Road Section", icon: FaListAlt, color: "bg-purple-100", textColor: "text-purple-800" },
  { key: "guide", label: "Guide", icon: FaClipboardList, color: "bg-pink-100", textColor: "text-pink-800" },
  { key: "admin", label: "Admin", icon: FaUserShield, color: "bg-indigo-100", textColor: "text-indigo-800" },
  { key: "outbreak", label: "Outbreak", icon: FaExclamationTriangle, color: "bg-orange-100", textColor: "text-orange-800" },
  { key: "caution", label: "Caution", icon: FaBell, color: "bg-teal-100", textColor: "text-teal-800" },
  { key: "dincident", label: "Dangerous Incident", icon: FaSkullCrossbones, color: "bg-rose-100", textColor: "text-rose-800" },
  { key: "vsl", label: "VSL", icon: FaCar, color: "bg-cyan-100", textColor: "text-cyan-800" },
  { key: "road_info", label: "Road Info", icon: FaInfoCircle, color: "bg-lime-100", textColor: "text-lime-800" },
];

const TABLES_BY_TYPE = {
  ROAD: ['outbreak', 'vsl', 'dincident', 'caution', 'road_info'],
  SERVICE: ['user', 'admin', 'road_section', 'navigation', 'path', 'guide'],
  _ADMIN: ['user', 'admin'], // 필요하면 추가
}

export default function Dashboard() {
  const router = useRouter();
  const [principalType, setPrincipalType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    const payload = parseJwt(token);
    if (!payload?.principal_type) {
      router.replace('/login');
      return;
    }
    setPrincipalType(payload.principal_type);
  }, [router]);

  if (!principalType) {
    return <p>로딩 중...</p>;
  }

  // principal_type에 맞는 허용 테이블만 필터링
  const allowedKeys = TABLES_BY_TYPE[principalType] || [];
  const filteredTables = tables.filter(table => allowedKeys.includes(table.key));

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>관리자 대시보드</h1>

      <div className={styles.cardsWrapper}>
        <div className={styles.cardsContainer}>
          {filteredTables.length > 0 ? (
            filteredTables.map(({ key, label, icon: Icon, color, textColor }) => (
              <Link
                key={key}
                href={`/${key}`}
                className={`${styles.card} ${color} ${textColor}`}
              >
                <Icon className={styles.cardIcon} />
                <div className={styles.cardLabel}>{label.replace(/_/g, " ")}</div>
                <p className={styles.cardDesc}>
                  {`Manage the ${label.replace(/_/g, " ")}`}
                </p>
              </Link>
            ))
          ) : (
            <p>접근 가능한 테이블이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
