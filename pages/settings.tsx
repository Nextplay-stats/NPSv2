import { useState, useEffect, ChangeEvent } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDarkMode from '@/components/useDarkMode';

export default function Settings() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const [darkMode, setDarkMode] = useDarkMode();
  const [language, setLanguage] = useState(i18n.language);

  // Sync language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || i18n.language;
    if (savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      setLanguage(savedLang);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
    alert(t('save')?.toString() || 'Saved');
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            className="w-8 h-8"
            alt={t('logoAlt')?.toString() || 'Logo'}
          />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label={t('account')?.toString() || 'Account'}
          items={[
            { label: t('dashboard')?.toString(), onClick: () => router.push('/dashboard') },
            { label: t('account')?.toString(), onClick: () => router.push('/account') },
            { label: t('settings')?.toString(), onClick: () => router.push('/settings') },
            { label: t('help')?.toString(), onClick: () => router.push('/help') },
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12">
        <h1 className="text-2xl font-bold mb-6">{t('settings')?.toString()}</h1>

        <div
          className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-md p-6 w-full max-w-md space-y-4`}
        >
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
              aria-checked={darkMode}
            />
            <span>{t('darkMode')?.toString()}</span>
          </label>

          <label className="block">
            <span>{t('language')?.toString()}</span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              aria-label={t('language')?.toString() || 'Language'}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </label>

          <button
            type="button"
            onClick={handleSave}
            className="bg-[#3e5e73] hover:bg-[#2d4a5e] text-white font-semibold py-2 px-4 rounded"
          >
            {t('save')?.toString()}
          </button>
        </div>
      </main>
    </div>
  );
}

// Server-side i18n support
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
