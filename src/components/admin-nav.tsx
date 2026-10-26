"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/admin",
    label: "ড্যাশবোর্ড",
    icon: (
      <path d="M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-3H4v3Zm10-13h6V4h-6v3Z" />
    ),
  },
  {
    href: "/admin/courses",
    label: "কোর্স",
    icon: <path d="M4 5h16v14H4zM8 9h8M8 13h5" />,
  },
  {
    href: "/admin/orders",
    label: "অর্ডার",
    icon: <path d="M5 8h14l-1 12H6L5 8Zm3 0V6a4 4 0 0 1 8 0v2" />,
  },
  {
    href: "/admin/students",
    label: "স্টুডেন্ট",
    icon: (
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
    ),
  },
  {
    href: "/admin/messages",
    label: "মেসেজ",
    icon: <path d="M4 5h16v11H9l-5 4V5Z" />,
  },
];

export function AdminNav({ messageCount = 0 }: { messageCount?: number }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav
      className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      aria-label="অ্যাডমিন মেনু"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`admin-nav-link shrink-0 ${isActive(item.href) ? "active" : ""}`}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {item.icon}
          </svg>
          <span>{item.label}</span>
          {item.href === "/admin/messages" && messageCount > 0 && (
            <span className="ml-auto rounded-full bg-orange px-1.5 py-0.5 text-[0.6rem] font-bold text-navy">
              {new Intl.NumberFormat("bn-BD").format(messageCount)}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
