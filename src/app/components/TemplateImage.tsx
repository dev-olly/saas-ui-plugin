import React from 'react';
import { SaaSComponent } from './types';

export const TemplateImage = ({ data }: { data: SaaSComponent }) => {
  return (
    <div className="relative">
      <img src={data.img_src} alt={data.name} className="w-full h-48 object-cover rounded-md" />
    </div>
  );
};
