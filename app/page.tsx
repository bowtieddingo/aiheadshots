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

const LeadForm = dynamic(() => import('../components/LeadForm'), { ssr: false });

export default function Home() {
  return (
<div className="flex flex-col min-h-screen">
    <TopNav />
    <main className="font-sans">
      <Hero />
      <LeadForm
        title="Join Our Beta"
        subtitle="Sign up now to get early access and exclusive offers for our new SaaS platform."
        buttonText="Get Early Access"
      />
      <CallToAction 
        text="Ready to upgrade your professional image?" 
        buttonText="Generate Your Headshot"
      />
      <SocialProof 
        testimonials={[
          { name: "John Doe", role: "Marketing Manager", text: "This AI headshot generator saved me time and money. The results are impressive!" },
          { name: "Jane Smith", role: "Software Engineer", text: "I was skeptical at first, but the quality of the headshots exceeded my expectations." },
          { name: "Mike Johnson", role: "Freelance Consultant", text: "As a freelancer, this tool helps me maintain a professional image across all platforms." }
        ]}
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
    </main>
    <Footer />
    </div>
  );
}
