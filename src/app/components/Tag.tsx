import React from 'react';

export const Tag = ({ name }: { name: string }) => {
  return (
    <button className="tag p-2 border-1 border-black rounded-sm">
      <span className="text-xs capitalize">{name}</span>
    </button>
  );
};
