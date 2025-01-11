import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Header } from './Header';
import { Sidder } from './Sidder';

const BaseLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex overflow-hidden h-full w-full">
      <Sidder isOpen={isOpen} />
      <div className="flex-1 flex flex-col">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 p-4 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
