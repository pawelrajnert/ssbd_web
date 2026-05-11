// src/shared/components/sidebar/SidebarItem.tsx
import {Link, useLocation} from "react-router-dom";
import type {LucideIcon} from "lucide-react";
import {useAuth} from "../../../hooks/useAuth";
import type {Role} from "../../../types/role.types";

export interface SidebarItemProps {
    to: string;
    icon: LucideIcon;
    label: string;
    allowedRoles?: Role[];
}

export default function SidebarItem({to, icon: Icon, label, allowedRoles}: SidebarItemProps) {
    const location = useLocation();
    const {activeRole} = useAuth();

    const isAllowed = !allowedRoles || (activeRole && allowedRoles.includes(activeRole as Role));

    if (!isAllowed) {
        return null;
    }

    const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                isActive
                    ? "bg-white text-[#7A1014] shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
        >
            <Icon size={18} className={isActive ? "text-[#7A1014]" : "text-gray-400"}/>
            {label}
        </Link>
    );
}