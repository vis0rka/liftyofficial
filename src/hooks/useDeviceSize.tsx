'use client';

import * as React from 'react';

type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | undefined;

const useDeviceSize = ({
  defaultDeviceSize,
}: {
  defaultDeviceSize: DeviceType;
}) => {
  const [deviceSize, setDeviceSize] =
    React.useState<DeviceType>(defaultDeviceSize);

  const getDeviceSize = (): DeviceType => {
    if (window.matchMedia('(min-width: 1536px)').matches) return '2xl';
    if (window.matchMedia('(min-width: 1280px)').matches) return 'xl';
    if (window.matchMedia('(min-width: 1024px)').matches) return 'lg';
    if (window.matchMedia('(min-width: 768px)').matches) return 'md';
    if (window.matchMedia('(min-width: 640px)').matches) return 'sm';
    if (window.matchMedia('(min-width: 0px)').matches) return 'xs';
  };

  React.useEffect(() => {
    const handleResize = () => {
      const currentDeviceSize = getDeviceSize();
      setDeviceSize(currentDeviceSize);
      document.cookie = `device-size=${JSON.stringify(currentDeviceSize)}`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { deviceSize };
};

export { useDeviceSize, type DeviceType };
