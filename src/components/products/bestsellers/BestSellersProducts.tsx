'use server';
import { getCachedProducts } from '@/lib/api/woo/products/getProducts';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';
import { CardImage } from '../card/CardImage';
import { Button } from '@/components/ui/button';

export const BestSellersProducts = async () => {
  const allProduct = await getCachedProducts();
  const t = await getTranslations('HomePage');

  if (!allProduct) return null;

  const sortedProducts = [...allProduct]
    .sort((a, b) => b.total_sales - a.total_sales)
    .splice(0, 4);

  return (
    <section className="container mx-auto flex flex-col px-4">
    <div className="flex w-full flex-col space-y-4">
      <h1 className="text-4xl">{t('bestsellers')}:</h1>
      <div className="flex w-full overflow-x-auto py-4 lg:flex-wrap lg:overflow-visible gap-4">
        {sortedProducts.map((product) => (
          <div
            className="flex-shrink-0 flex flex-col lg:flex-1 shadow rounded-md min-w-[250px] max-w-[150px] lg:max-w-full"
            key={product.id}
          >
            <CardImage productImages={product.images} />

            <div className="p-5 flex flex-col items-center">
              <h1 className="text-lg text-center font-bold">
                Lifty - {t('toddler_carrier')}
              </h1>
              <div className="flex flex-col justify-center items-center">
                <span className="text-center text-2xl font-bold font-sans">
                  € {product.price}
                </span>
              </div>
              <Button className="mt-4">
                <p>View</p>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};
