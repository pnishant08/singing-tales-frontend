import React from 'react';
import Hero from './Hero/Hero';
import Occasions from './Occasions/Occasions';
import FeaturedCards from './FeaturedCard/FeaturedCard';

export default function Home() {
  return (
    <>
      <Hero />
      <Occasions />
      <FeaturedCards />
    </>
  );
}