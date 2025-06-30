import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 pl-4 tracking-wide">Platform</h4>
      <div className="flex flex-col">
        {items.map((item, index) => {
          const isOpen = openIndex === index || item.isActive;
          const Icon = item.icon;

          return (
            <div key={item.title}>
              <button
                className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition ${
                  isOpen ? "bg-gray-100 text-blue-600" : "text-gray-700"
                }`}
                onClick={() => toggleIndex(index)}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.title}</span>
                </div>
                {item.items && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                )}
              </button>

              {isOpen && item.items && (
                <ul className="pl-10 py-1 text-sm space-y-1 text-gray-600">
                  {item.items.map((subItem) => (
                    <li key={subItem.title}>
                      <a
                        href={subItem.url}
                        className="block px-2 py-1 rounded hover:text-blue-600 hover:bg-gray-100 transition"
                      >
                        {subItem.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
