import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const Loader = () => {
  return (
    <>
      <Skeleton height={150} />
      <Skeleton height={150} />
      <Skeleton height={150} />
      <Skeleton height={150} />
      <Skeleton height={150} />
    </>
  );
};
