'use server';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

const keyFeatuers = [
    {
      imageSrc: '/images/icons/feather-outline.webp',
      title: 'KeyFeatures.first.title',
      descr: 'KeyFeatures.first.description',
    },
    {
      imageSrc: '/images/icons/easy.webp',
      title: 'KeyFeatures.second.title',
      descr: 'KeyFeatures.second.description',
    },
    {
      imageSrc: '/images/icons/compact.webp',
      title: 'KeyFeatures.third.title',
      descr: 'KeyFeatures.third.description',
    },
];

export const KeyFeatures = async () => {
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-8 lg:flex-row items-center">
      {keyFeatuers.map((feature) => {
        return (
          <div
            className="lg:w-full flex flex-col items-center lg:w-1/3"
            key={feature.imageSrc}
          >
            <Image
              src={feature.imageSrc}
              alt="icon feather"
              width={60}
              height={60}
            />
            <h3 className="text-lg font-bold">{t(feature.title)}</h3>
            <p>{t(feature.descr)}</p>
          </div>
        );
      })}
    </div>
  );
};
