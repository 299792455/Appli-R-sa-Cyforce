import React from 'react';
import Header from '../components/Header';
import MainBanner from '../components/MainBanner';
import PresentationSection from '../components/PresentationSections';
import StepsSection from '../components/StepSection';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div>
      <Header />
      <MainBanner />
      <PresentationSection />
      <StepsSection />
      <Footer />
    </div>
  );
}

export default HomePage;
