import Link from "next/link";

type AdminKey = "home" | "noi-dung" | "hinh-anh" | "bai-viet";

const items: { key: AdminKey; label: string; href: string }[] = [
  { key: "home", label: "Trung tâm", href: "/admin" },
  { key: "noi-dung", label: "Nội dung trang chủ", href: "/admin/noi-dung" },
  { key: "hinh-anh", label: "Hình ảnh & video", href: "/admin/hinh-anh" },
  { key: "bai-viet", label: "Bài viết", href: "/admin/bai-viet" },
];

export default function AdminNav({ active }: { active: AdminKey }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-bold transition-colors ${
              isActive
                ? "bg-orange-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/"
        target="_blank"
        className="ml-auto inline-flex min-h-10 items-center rounded-full px-4 text-sm font-bold text-gray-500 hover:text-gray-900"
      >
        Xem web ↗
      </Link>
    </div>
  );
}
