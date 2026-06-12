/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Award, MapPin, Compass, ShieldCheck, Microscope, Landmark, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutView() {
  const values = [
    {
      icon: <Microscope className="h-6 w-6 text-teal-800" />,
      title: 'Practical Intuition First',
      description: 'We believe scientific laws are truly mastered only when student hands wire current meters, extract organic molecules, or examine botanical specimens in real-time labs.'
    },
    {
      icon: <Leaf className="h-6 w-6 text-teal-800" />,
      title: 'Biodiversity Stewards',
      description: 'Nested near the Brahmaputra riparian plains and Kaziranga biosphere, our Botany and Zoology divisions actively analyze local flora, fauna, and water tables.'
    },
    {
      icon: <Compass className="h-6 w-6 text-teal-800" />,
      title: 'UGC-CBCS Curriculum Alignment',
      description: 'Our courses strictly integrate the Gauhati University Choice Based Credit System (CBCS), ensuring smooth transition pathways for honors graduates into global central university roles.'
    }
  ];

  const milestones = [
    { year: '1963', title: 'College Foundation', details: 'Established to address higher education requirements of Jamugurihat under the patronage of local farmers, visionaries, and named in memory of the eminent freedom fighter Tyagbir Hem Baruah.' },
    { year: '1985', title: 'Science Stream Inauguration', details: 'Introduced Physics, Chemistry, and Mathematics honors streams, setting up the central science library.' },
    { year: '1988', title: 'Life Sciences Wing Expansion', details: 'Botany and Zoology departments were commissioned alongside a dedicated specimen museum and conservatory.' },
    { year: '2005', title: 'Central Computing Cell', details: 'Inaugurated centralized computing laboratories to deliver campus-wide IT training, soft skills, and statistical packages.' },
    { year: '2022', title: 'Major DST-FIST Infrastructure Grant', details: 'Upgraded all 5 departments with advanced research facilities, analytical softwares, and digitized classrooms.' }
  ];

  return (
    <div id="about-view-container" className="space-y-16 py-6 max-w-6xl mx-auto">
      
      {/* 1. Header Hero section */}
      <section className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          The Legacy of Tyagbir Hem Baruah College
        </span>
        <h2 className="font-display text-3.5xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Fostering Scientific Minds Since 1963
        </h2>
        <p className="max-w-2xl mx-auto text-slate-600 text-sm sm:text-base leading-relaxed">
          From a humble village setting to a DST-sponsored science division, explore the values and historic roots of our institution at Jamugurihat, Assam.
        </p>
      </section>

      {/* 2. College Profile Grid */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
            <Landmark className="h-5 w-5" />
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-900 leading-tight">
            An Academic Sanctorum Built on Community Patriotism
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            Tyagbir Hem Baruah College (T.H.B. College) was set up at Jamugurihat, Sonitpur, Assam to pay homage to the tireless spirit of the legendary freedom fighter Tyagbir Hem Baruah. What started as an earnest public effort has blossomed into one of the premiere institutions of Eastern Sonitpur.
            {"\n\n"}
            The Science Stream was initiated to nurture critical research and logical thinking in rural youth. Today, the science division supports six specialized Honors programs, modern experimental resources, and maintains active collaborations with the Assam Science Association.
          </p>
          
          <div className="flex flex-col gap-3 rounded-2xl bg-teal-50/50 border border-teal-100 p-4">
            <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs uppercase tracking-wide">
              <MapPin className="h-4 w-4 text-teal-700" />
              <span>Campus Location Geographics</span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Karchola, Jamugurihat, Sonitpur District, Assam - Pin 784180. The campus lies in close proximity to the historic Puranigudam and the scenic tea gardens of North Brahmaputra, providing an organic biological environment for research.
            </p>
          </div>
        </div>

        {/* Vision Statement Panel */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 overflow-hidden shadow-xl">
          <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl"></div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-teal-300">Our Institutional Mission</span>
            </div>
            <h4 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl leading-snug">
              "To democratize scientific study and foster an eco-ethical mindset inside young explorers."
            </h4>
            
            <div className="space-y-4 pt-4 border-t border-slate-800 text-slate-300 text-xs sm:text-sm">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p><strong className="text-white">Academic Integrity:</strong> Delivering peerless theoretical lessons alongside certified lab records following international conventions.</p>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p><strong className="text-white">Sustainable Focus:</strong> Minimizing hazardous chemicals in our organic labs and pursuing botanical conservation.</p>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p><strong className="text-white">Inclusivity:</strong> Ensuring quality study resources are always available freely to students from rural villages.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values Row */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Core Scientific Pillars
          </h3>
          <p className="text-xs text-slate-500 mt-1">Guiding educational standards inside every honors program</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-xs transition-shadow flex flex-col space-y-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                {val.icon}
              </div>
              <h4 className="font-display text-base font-bold text-slate-950">
                {val.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Timeline Milestones */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Stream History & Milestones
          </h3>
          <p className="text-xs text-slate-500 mt-1">Tracing local progression through the decades</p>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-8">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="relative pl-6 md:pl-8">
              {/* Dot indicator */}
              <span className="absolute -left-2.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-800 ring-4 ring-white">
                <span className="h-2 w-2 rounded-full bg-teal-300"></span>
              </span>
              
              {/* Year tooltip for desktop screen side layout */}
              <div className="hidden md:block absolute -left-32 top-1 w-24 text-right font-display text-lg font-bold text-teal-800">
                {milestone.year}
              </div>
              
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-teal-200 transition-colors">
                <span className="inline-block md:hidden text-xs font-extrabold text-teal-850 bg-teal-50 px-2 py-0.5 rounded-sm mb-1.5">
                  {milestone.year}
                </span>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  {milestone.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {milestone.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
