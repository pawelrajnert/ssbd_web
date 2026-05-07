// src/shared/components/sidebar/Sidebar.tsx
import {Users} from "lucide-react";
import {useTranslation} from "react-i18next";
import {PATHS} from "../../../routes/paths.ts";
import SidebarItem from "./SidebarItem.tsx";
import {RoleEnum} from "../../../types/role.types.ts";

export default function Sidebar() {
    const {t} = useTranslation();
    return (
        <aside
            className="w-64 bg-[#f8f9fa] border-r border-gray-100 flex flex-col justify-between hidden md:flex shrink-0">
            <div className="py-6 px-3 space-y-1">

                <SidebarItem
                    to={PATHS.USER_LIST}
                    icon={Users}
                    label={t('sidebar.userManagement', 'User Management')}
                    allowedRoles={[RoleEnum.ADMINISTRATOR]}
                />

                {/*<SidebarItem*/}
                {/*    to="/"*/}
                {/*    icon={FileText}*/}
                {/*    label={t('sidebar.reports', 'Plagiarism Reports')}*/}
                {/*/>*/}
            </div>

            {/*<div className="p-4 mb-2">*/}
            {/*    <SidebarItem*/}
            {/*        to="/"*/}
            {/*        icon={HelpCircle}*/}
            {/*        label={t('sidebar.help', 'Help Center')}*/}
            {/*    />*/}
            {/*</div>*/}
        </aside>
    );
}