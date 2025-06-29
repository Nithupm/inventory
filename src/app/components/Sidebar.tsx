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
    <aside className="w-[90px] h-screen bg-blue-950 text-gray-200 flex flex-col">
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
              className={`flex items-center px-3 py-2 rounded-md mb-2 transition-colors ${
                active
                  ? "bg-blue-400 text-white"
                  : "hover:bg-blue-400 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
