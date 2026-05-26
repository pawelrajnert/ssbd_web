import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, RefreshCw } from 'lucide-react';
import { subjectService } from '../../services/subjectService.ts';
import type { SubjectDTO } from '../../types/SubjectDTO';
import { PATHS } from '../../routes/paths';

export function TeacherSubjectListPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState<SubjectDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadSubjects = async () => {
        setIsLoading(true);
        try {
            const data = await subjectService.getSubjects();
            setSubjects(data);
        } catch (error) {
            console.error("Błąd ładowania przedmiotów", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    return (
        <div className="p-8 bg-base min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">{t('subject.list.title', 'Lista przedmiotów')}</h1>
                    <button
                        onClick={() => navigate(PATHS.CREATE_SUBJECT)} // Użyj ścieżki z PATHS
                        className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-md font-bold text-sm uppercase tracking-widest transition-colors"
                    >
                        <Plus size={18} />
                        {t('subject.create.title', 'Utwórz przedmiot')}
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-8"><RefreshCw className="animate-spin text-brand" size={32} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.length > 0 ? subjects.map((sub) => (
                            <div key={sub.id} className="bg-surface p-6 rounded-xl border border-border shadow-sm hover:border-brand transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <BookOpen className="text-brand" />
                                    <h2 className="font-bold text-primary text-lg">{sub.name}</h2>
                                </div>
                                <p className="text-sm text-secondary mb-2">Edycja: {sub.edition}</p>
                                <a href={sub.giteaURL} target="_blank" rel="noreferrer" className="text-xs text-brand font-bold uppercase underline">Gitea</a>
                            </div>
                        )) : (
                            <p className="text-secondary">{t('subject.list.empty', 'Brak przedmiotów do wyświetlenia.')}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}