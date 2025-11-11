"use client";
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import ProductCard, { ProductHit, searchListinToProductHit } from '@/components/search/ProductCard';
import { GetUserListingsUseCase } from '@/domain/usecases/listings/GetUserListingsUseCase';
import { ListingsRepositoryImpl } from '@/data/repositories/ListingsRepositoryImpl';
import { SearchResult } from '@/domain/models/SearchResult';
import { SearchListing } from '@/domain/models/SearchListing';
import { GetUserByIdUseCase } from '@/domain/usecases/users/GetUserByIdUseCase';
import { UsersRepositoryImpl } from '@/data/repositories/UsersRepositoryImpl';
import { User } from '@/domain/models/User';
import Avatar from '@/components/ui/Avatar';

export type ProductMedia = {
  id: string;
  type: string;
  image: string;
  image_url: string;
};

export type ProductItem = {
  id: string;
  title: string;
  price_amount?: number;
  price_currency?: string;
  price_normalized?: number;
  media?: ProductMedia[];
  location_name_ru?: string;
  location_name_uz?: string;
  refreshed_at?: string;
  is_promoted?: boolean;
  condition?: string;
};

// convert ProductItem to ProductHit

export default function UserProfilePage() {
  const { userId } = useParams();
  const { t, locale } = useI18n();
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [error, setError] = useState('');

  const label = (ru: string, uz: string) => (locale === 'uz' ? uz : ru);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);

        // Fetch user info
        const getUserUseCase = new GetUserByIdUseCase(new UsersRepositoryImpl());
        const userData = await getUserUseCase.execute(Number(userId));
        setSeller(userData);

        // Fetch user listings
        const getListingsUseCase = new GetUserListingsUseCase(new ListingsRepositoryImpl());
        const listingsData = await getListingsUseCase.execute({
          userId: Number(userId),
          sort: sort
        });
        console.log('User listings data:', listingsData);
        setListings(listingsData);
      } catch (e: any) {
        setError(e.message || label('Ошибка загрузки', 'Yuklashda xatolik'));
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserData();
    }
  }, [userId, sort, locale]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="text-gray-600">{label('Загрузка...', 'Yuklanmoqda...')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  const lastActiveAt = seller?.lastActiveAt ? new Date(seller.lastActiveAt) : null;
  const since = seller?.since ? new Date(seller.since) : null;
  return (
    <div className="container py-6">
      {/* Seller Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar
            className="seller-avatar"
            imageUrl={seller?.avatarUrl || seller?.logo}
            placeholder={seller?.displayName ?? 'User'}
            alt={seller?.displayName || label('Пользователь', 'Foydalanuvchi')}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {seller?.displayName || label('Пользователь', 'Foydalanuvchi')}
            </h1>
            <div className="seller-meta">
              {t('listing.onSiteAt')}{' '}
              {(lastActiveAt ?? since)?.toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU', {
                day: 'numeric',
                year: 'numeric',
                month: 'short'
              }) || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {label('Объявления', "E'lonlar")} ({listings.length})
          </h2>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">{label('Сортировка:', 'Saralash:')}</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20"
            >
              <option value="newest">{label('Сначала новые', 'Eng yangi')}</option>
              <option value="oldest">{label('Сначала старые', 'Eng eski')}</option>
              <option value="price_asc">{label('Цена: по возрастанию', "Narx: o'sish")}</option>
              <option value="price_desc">{label('Цена: по убыванию', 'Narx: kamayish')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {label('Нет объявлений', "E'lonlar yo'q")}
          </h3>
          <p className="text-gray-600">
            {label('У этого пользователя пока нет активных объявлений', "Bu foydalanuvchida hali faol e'lonlar yo'q")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing: SearchListing) => (
            <ProductCard
              key={listing.id}
              hit={searchListinToProductHit(listing)}
              href={`/l/${listing.id}`}
              locale={locale}
              viewMode="list"
            />
          ))}
        </div>
      )}
    </div>
  );
}
