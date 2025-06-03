import { useState, useEffect } from 'react';
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

  // Sync language from localStorage or i18n on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || i18n.language;
    if (savedLang !== language) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n, language]);

  const handleSave = () => {
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
    alert(t('save'));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt={t('logoAlt')?.toString() || 'Logo'} />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label={t('account')}
          items={[
            { label: t('dashboard'), onClick: () => router.push('/dashboard') },
            { label: t('account'), onClick: () => router.push('/account') },
            { label: t('settings'), onClick: () => router.push('/settings') },
            { label: t('help'), onClick: () => router.push('/help') },
            // add logout or others if needed
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12">
        <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>

        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-md p-6 w-full max-w-md space-y-4`}>
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
              aria-checked={darkMode}
            />
            <span>{t('darkMode')}</span>
          </label>

          <label className="block">
            <span>{t('language')}</span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              aria-label={t('language')}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </label>

          <button
            type="button"
            onClick={handleSave}
            className="bg-[#3e5e73] hover:bg-[#2d4a5e] text-white font-semibold py-2 px-4 rounded"
          >
            {t('save')}
          </button>
        </div>
      </main>
    </div>
  );
}

// Server-side translations for locale
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
