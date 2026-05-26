import {Users, LucideGraduationCap, Settings} from "lucide-react";
import {useTranslation} from "react-i18next";
import {PATHS} from "../../../routes/paths.ts";
import SidebarItem from "./SidebarItem.tsx";
import {RoleEnum} from "../../../types/role.types.ts";

export default function Sidebar() {
    const {t} = useTranslation();
    return (
        <aside
            className="w-64 bg-base border-r border-border flex flex-col justify-between hidden md:flex shrink-0">
            <div className="py-6 px-3 space-y-1">
                {/** Elementy dla admina */}
                <SidebarItem
                    to={PATHS.USER_LIST}
                    icon={Users}
                    label={t('sidebar.userManagement', 'User Management')}
                    allowedRoles={[RoleEnum.ADMINISTRATOR]}
                />

                {/** Elementy dla studenta */}
                <SidebarItem
                    to={PATHS.STUDENT_SUBJECT_LIST}
                    icon={LucideGraduationCap}
                    label={t('sidebar.subjectList', 'Subject list')}
                    allowedRoles={[RoleEnum.STUDENT]}
                />

                {/** Elementy dla Prowadzącego */}
                <SidebarItem
                    to={PATHS.TEACHER_SUBJECT_LIST}
                    icon={LucideGraduationCap}
                    label={t('sidebar.subjectList', 'Subject list')}
                    allowedRoles={[RoleEnum.TEACHER]}
                />
                <SidebarItem
                    to={PATHS.GLOBAL_RULES}
                    icon={Settings}
                    label={t('sidebar.globalRules', 'Global rules')}
                    allowedRoles={[RoleEnum.TEACHER]}
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