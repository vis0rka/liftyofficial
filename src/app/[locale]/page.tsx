import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Herobanner } from '@/components/herobanner/Herobanner';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <Herobanner />
    </div>
  );
}
