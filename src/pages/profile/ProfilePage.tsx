import React, {useState, useEffect} from 'react';
import {useAuth} from '../../hooks/useAuth';
import {getAccountByLogin} from '../../services/accountService';
import {ChangeOwnPasswordForm} from './ChangeOwnPasswordForm';
import LinkButton from "../../shared/components/buttons/LinkButton.tsx";
import {PATHS} from "../../routes/paths.ts";
import type {AccountWithAccessLevelsDTO} from "../../types/user.types.ts";

export const ProfilePage: React.FC = () => {
    const {userLogin, token} = useAuth();
    console.log("Token w sesji:", token);
    console.log("Zdekodowany login:", userLogin);
    const [user, setUser] = useState<AccountWithAccessLevelsDTO>();
    const [loading, setLoading] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        if (userLogin) {
            getAccountByLogin(userLogin)
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Błąd pobierania profilu:", err);
                    setLoading(false);
                });

        }
    }, [userLogin]);

    if (loading) return <div className="p-8 text-center text-gray-500">Ładowanie profilu...</div>;
    if (!user) return <div className="p-8 text-center text-red-500">Nie udało się załadować danych użytkownika.</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Ustawienia Konta</h1>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Informacje osobiste</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Imię i Nazwisko</p>
                            {/* POPRAWKA: Czytamy dane z user.account */}
                            <p className="font-medium">{user.account.name} {user.account.surname}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user.account.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Login</p>
                            <p className="font-medium">{user.account.login}</p>
                        </div>
                    </div>
                    <LinkButton to={PATHS.USER_EDIT_ME} className={"max-w-40"}>
                        Edytuj
                    </LinkButton>
                    <LinkButton to={PATHS.USER_LIST} className={"max-w-40"}>
                        Lista użytkowników
                    </LinkButton>
                </div>

                <div className="p-6 bg-gray-50">
                    {!showPasswordForm ? (
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-gray-800">Bezpieczeństwo</h3>
                                <p className="text-sm text-gray-500">Ostatnia zmiana hasła może zwiększyć bezpieczeństwo
                                    Twojego konta.</p>
                            </div>
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="bg-[#7A1014] hover:bg-red-900 text-white font-bold px-4 py-2 rounded-md transition-colors"
                            >
                                Zmień własne hasło
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-gray-800">Zmień hasło</h3>
                                <button
                                    onClick={() => setShowPasswordForm(false)}
                                    className="text-gray-400 hover:text-gray-600 font-bold"
                                >
                                    Anuluj
                                </button>
                            </div>
                            <ChangeOwnPasswordForm
                                version={user.account.versionHash}
                                onSuccess={() => {
                                    alert('Hasło zmienione pomyślnie!');
                                    setShowPasswordForm(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};