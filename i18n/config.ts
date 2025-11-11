import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './ru.json';
import uz from './uz.json';

export type Locale = 'ru' | 'uz';

i18next
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'ru',
    resources: {
      ru: { translation: ru },
      uz: { translation: uz },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
