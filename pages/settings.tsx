import { useState, useEffect } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Settings() {
  const { t, i18n } = useTranslation('common');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(i18n.language);
  const router = useRouter();

  useEffect(() => {
    // Load saved settings on mount
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedLang = localStorage.getItem('language') || i18n.language;
    setDarkMode(savedDarkMode);
    setLanguage(savedLang);
    if (savedLang !== i18n.language) i18n.changeLanguage(savedLang);
  }, [i18n]);

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
          <img src="/logo.png" className="w-8 h-8" alt="Logo" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label="Account"
          items={[
            { label: t('settings'), onClick: () => router.push('/settings') },
            // add other menu items here
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12">
        <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>
        <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md space-y-4">
          <label className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>{t('darkMode')}</span>
          </label>

          <label className="block">
            <span>{t('language')}</span>
            <select value={language} onChange={handleLanguageChange} className="mt-1 block w-full border border-gray-300 rounded p-2">
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </label>

          <button
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

// Required for server-side rendering of translations
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
