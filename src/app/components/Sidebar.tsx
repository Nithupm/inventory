"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdEvent,
  MdOutlineInventory,
  MdOutlineInsertChart,
  MdSettings,
} from "react-icons/md";

export default function Sidebar() {
  const path = usePathname();

  const menu = [
    { href: "/", icon: MdDashboard },
    { href: "/events", icon: MdEvent },
    { href: "/inventory", icon: MdOutlineInventory },
    { href: "/reports", icon: MdOutlineInsertChart },
    { href: "/settings", icon: MdSettings },
  ];

  return (
    <aside className="w-[70px] h-screen bg-[#15005E] text-gray-200 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <span className="text-xl font-semibold">1Box</span>
      </div>

      <nav className="flex-1 px-4 py-6">
        {menu.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex justify-center items-center h-12 rounded-md mb-2 transition-colors ${
                active
                  ? "bg-[#00c2f4] text-white"
                  : "hover:bg-[#00c2f4] hover:text-white"
              }`}
            >
              <item.icon className="w-6 h-6 text-xl" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
