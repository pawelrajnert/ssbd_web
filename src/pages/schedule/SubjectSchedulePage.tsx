import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams, useNavigate} from 'react-router-dom';
import {scheduleService} from '../../services/scheduleService';
import {type ScheduleDTO, ScheduleStatus, type FilterStatus} from '../../types/schedule.types';
import {formatDate} from '../../services/reportService';
import {CalendarClock, Filter, RefreshCw, ArrowLeft, ArrowUp, ArrowDown, ArrowUpDown, Plus} from 'lucide-react';
import {CreateScheduleModal} from "./CreateScheduleModal";
import axios from 'axios';

type SortColumn = 'date' | 'tag';

const getSafeTimestamp = (dateString?: string): number => {
    if (!dateString) return 0;
    const time = new Date(dateString).getTime();
    return isNaN(time) ? 0 : time;
};

const STATUS_STYLES: Record<ScheduleStatus, string> = {
    [ScheduleStatus.PLANNED]: 'bg-blue-600 text-white shadow-sm dark:bg-blue-700',
    [ScheduleStatus.EXECUTED]: 'bg-green-600 text-white shadow-sm dark:bg-green-700',
};

export const SubjectSchedulePage: React.FC = () => {
    const {id: subjectId} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const [schedules, setSchedules] = useState<ScheduleDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
    const [tagFilter, setTagFilter] = useState<string>('');

    const [sortColumn, setSortColumn] = useState<SortColumn>('date');
    const [sortDesc, setSortDesc] = useState<boolean>(true);

    const [lastServerTime, setLastServerTime] = useState<number>(Date.now());

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchSchedules = useCallback(async () => {
        if (!subjectId) return;
        setIsLoading(true);
        try {
            const {schedules: fetched, serverTimeMs} =
                await scheduleService.getSchedulesForSubject(subjectId);
            setLastServerTime(serverTimeMs);
            setSchedules(fetched);
            setError(null);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                console.log('Status błędu:', err.response?.status);
            }
            setError(t('schedule.error.fetch'));
        } finally {
            setIsLoading(false);
        }
    }, [subjectId, t]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDesc(prev => !prev);
        } else {
            setSortColumn(column);
            setSortDesc(false);
        }
    };

    const renderSortIcon = (column: SortColumn) => {
        if (sortColumn !== column)
            return <ArrowUpDown size={14} className="text-secondary opacity-50 group-hover:opacity-100 transition-opacity"/>;
        return sortDesc
            ? <ArrowDown size={14} className="text-primary"/>
            : <ArrowUp size={14} className="text-primary"/>;
    };

    const sortedAndFiltered = useMemo(() => {
        const mapped = schedules.map(s => ({
            ...s,
            calculatedStatus: lastServerTime >= getSafeTimestamp(s.scheduleDateTime)
                ? ScheduleStatus.EXECUTED
                : ScheduleStatus.PLANNED,
        }));

        const filtered = mapped.filter(s => {
            const matchesStatus = statusFilter === 'ALL' || s.calculatedStatus === statusFilter;
            const matchesTag = tagFilter === '' || (s.tag && s.tag.toLowerCase().includes(tagFilter.toLowerCase()));
            return matchesStatus && matchesTag;
        });

        return [...filtered].sort((a, b) => {
            const diff = sortColumn === 'tag'
                ? (a.tag || '').localeCompare(b.tag || '')
                : getSafeTimestamp(a.scheduleDateTime) - getSafeTimestamp(b.scheduleDateTime);

            return sortDesc ? -diff : diff;
        });
    }, [schedules, lastServerTime, statusFilter, tagFilter, sortColumn, sortDesc]);

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateSchedule = async (scheduleToSave: ScheduleDTO) => {
        if (!subjectId) return;

        try {
            setIsLoading(true);

            await scheduleService.createSchedule(subjectId, scheduleToSave);

            setIsCreateModalOpen(false);
            fetchSchedules();
        } catch (err: unknown) {
            console.error("Błąd podczas dodawania harmonogramu:", err);
            setError('Wystąpił błąd podczas planowania analizy');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base p-8">
            <div className="max-w-7xl mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 font-medium"
                >
                    <ArrowLeft className="w-5 h-5"/>
                    {t('common.back')}
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">
                            {t('schedule.modal.title')}
                        </h1>
                        <p className="text-secondary text-sm max-w-2xl leading-relaxed">
                            {t('schedule.subtitle')}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={fetchSchedules}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-active rounded-md text-sm font-bold text-primary transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''}/>
                            {t('common.refresh')}
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover rounded-md text-sm font-bold text-white transition-colors"
                        >
                            <Plus size={16} />
                            {t('schedule.modal.title')}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="relative flex items-center bg-surface border border-border rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand transition-all">
                        <Filter size={16} className="text-secondary mr-2"/>
                        <input
                            type="text"
                            placeholder={`${t('schedule.tag')}...`}
                            value={tagFilter}
                            onChange={e => setTagFilter(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-primary focus:outline-none w-24 sm:w-32 placeholder:text-secondary/60"
                        />
                    </div>

                    <div className="relative flex items-center bg-surface border border-border rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand transition-all">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as FilterStatus)}
                            className="bg-transparent text-sm font-semibold text-primary focus:outline-none cursor-pointer appearance-none pr-4"
                        >
                            <option value="ALL">{t('schedule.status.all')}</option>
                            <option value={ScheduleStatus.PLANNED}>{t('schedule.status.planned')}</option>
                            <option value={ScheduleStatus.EXECUTED}>{t('schedule.status.executed')}</option>
                        </select>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-visible">
                    <div className="overflow-x-visible">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-border bg-surface select-none">
                                <th
                                    onClick={() => handleSort('date')}
                                    className="py-6 px-8 text-xs font-bold text-secondary uppercase tracking-widest cursor-pointer group hover:bg-active transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {t('schedule.date')}
                                        {renderSortIcon('date')}
                                    </div>
                                </th>
                                <th
                                    onClick={() => handleSort('tag')}
                                    className="py-6 px-8 text-xs font-bold text-secondary uppercase tracking-widest cursor-pointer group hover:bg-active transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {t('schedule.tag')}
                                        {renderSortIcon('tag')}
                                    </div>
                                </th>
                                <th className="py-6 px-8 text-xs font-bold text-secondary uppercase tracking-widest">
                                    {t('schedule.statusLabel')}
                                </th>
                            </tr>
                            </thead>
                            <tbody className={`divide-y divide-border transition-opacity duration-200 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                            {error ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-danger font-medium">
                                        {error}
                                    </td>
                                </tr>
                            ) : sortedAndFiltered.length === 0 && !isLoading ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-secondary">
                                        {t('schedule.empty')}
                                    </td>
                                </tr>
                            ) : (
                                sortedAndFiltered.map(s => (
                                    <tr key={s.id} className="hover:bg-base transition-colors group">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-base flex items-center justify-center text-secondary border border-border group-hover:bg-surface transition-colors">
                                                    <CalendarClock size={20}/>
                                                </div>
                                                <span className="text-sm font-bold text-primary">
                                                    {formatDate(s.scheduleDateTime)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-sm text-secondary font-medium font-mono">
                                            {s.tag}
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${STATUS_STYLES[s.calculatedStatus]}`}>
                                                {s.calculatedStatus === ScheduleStatus.EXECUTED
                                                    ? t('schedule.status.executed').toUpperCase()
                                                    : t('schedule.status.planned').toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <CreateScheduleModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleCreateSchedule}
                />

            </div>
        </div>
    );
};