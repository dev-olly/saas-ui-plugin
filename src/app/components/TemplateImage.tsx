import React from 'react';
import { SaaSComponent } from './types';

export const TemplateImage = ({ data, onClick }: { data: SaaSComponent; onClick: (data: SaaSComponent) => void }) => {
  return (
    <div className="relative">
      <img
        src={data.img_src}
        alt={data.name}
        onClick={() => onClick(data)}
        className="w-full h-48 object-cover rounded-md cursor-pointer"
      />
    </div>
  );
};
