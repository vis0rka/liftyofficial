import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-secondary p-8">
      <div className="container mx-autoflex flex flex-row justify-between">
        <div>col 1</div>
        <div>col 2</div>
        <div>col 3</div>
        <div>col 4</div>
      </div>
      <div className='mt-4'>
        <p className='text-xs text-slate-500'>2024 ©lifty, All rights reserved</p>
      </div>
    </footer>
  );
};
