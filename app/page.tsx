// app/page.tsx
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CallToAction from '../components/CTA';
import SocialProof from '../components/SocialProof';
import Benefits from '../components/Benefits';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import BeforeAfter from '../components/BeforeAfter';

const LeadForm = dynamic(() => import('../components/LeadForm'), { ssr: false });

export default function Home() {
  return (
<div className="flex flex-col min-h-screen">
    <TopNav />
    <main className="font-sans">
      <Hero />
      <BeforeAfter
      beforeUrl="https://utfs.io/f/39336f23-f117-47d1-8713-8de14e48bf89-6shtvj.jpg"
      afterUrl="https://utfs.io/f/47e150b8-a9af-400e-95bd-012600a6cd74-vmbdcc.png"
      beforeAlt="Before AI enhancement"
      afterAlt="After AI enhancement"
    />
      <SocialProof 
        testimonials={[
          { name: "John Doe", role: "Marketing Manager", text: "This AI headshot generator saved me time and money. The results are impressive!" },
          { name: "Jane Smith", role: "Software Engineer", text: "I was skeptical at first, but the quality of the headshots exceeded my expectations." },
          { name: "Mike Johnson", role: "Freelance Consultant", text: "As a freelancer, this tool helps me maintain a professional image across all platforms." }
        ]}
      />
     <CallToAction 
        text="Ready to upgrade your professional image?" 
        buttonText="Generate Your Headshot"
      />
     <Benefits />
      <CallToAction 
        text="Join thousands of professionals who've upgraded their image" 
        buttonText="Start Now"
      />
      <Features />
      <Pricing />
      <SocialProof 
        testimonials={[
          { name: "Sarah Lee", role: "HR Specialist", text: "We use this for all our employee profiles. It's consistent and professional." },
          { name: "Tom Brown", role: "Recent Graduate", text: "This tool helped me create a great first impression for job applications." },
          { name: "Emily Chen", role: "Entrepreneur", text: "Quick, easy, and effective. Perfect for busy professionals like me." }
        ]}
      />
      <CallToAction 
        text="Ready to transform your professional image?" 
        buttonText="Generate Your Headshot Now"
      />
      <LeadForm
        title="Join Our Community"
        subtitle="Sign up now to get exclusive offers and discounts"
        buttonText="Join Our Community"
      />
    </main>
    <Footer />
    </div>
  );
}
