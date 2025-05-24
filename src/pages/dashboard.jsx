import Link from 'next/link'

const tableList = [
  "admin", 
  "user",
  "guide",
  "navigation",
  "caution",
  "road_section",
  "dincident",
  "outbreak",
  "vsl",
  "favorite_place",
  "path",
]

export default function Dashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tableList.map((table) => (
          <Link
            key={table}
            href={`/${table}`}
            className="border rounded p-6 text-center hover:bg-gray-100 transition"
          >
            <div className="text-xl font-semibold capitalize">{table.replace(/_/g, ' ')}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
