"use client"
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import {
  ClipboardX,
  Hash,
  LoaderCircle,
  MapPin,
  Send,
  Smartphone,
  Truck,
  User
} from 'lucide-react';
import React, { useState } from 'react';

const VehicleEntryForm = () => {
  // Mock state (in your real app, this will come from the database)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_type: 'Bus',
    vehicle_number: '',
    representative_name: '',
    representative_mobile: '',
    driver_mobile: '',
    division: '',
    district: '',
    thana: '',
  });

  const isFormActive = useQuery(api.form_status.get);

  const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Submission simulation
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('Submitted Data:', formData);
    }, 2000);
  };

  // If the form is closed, full-page design
  if (!isFormActive) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-10 flex flex-col items-center transition-all hover:shadow-md">
          
          {/* Icon Container */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
              <ClipboardX className="text-slate-400" size={48} strokeWidth={1.5} />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3 text-center">
            <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">
              ফরমটি বর্তমানে বন্ধ আছে
            </h3>
            <p className="text-slate-500 leading-relaxed font-light">
              দুঃখিত, নির্ধারিত সময় অতিক্রান্ত হওয়ায় অথবা টেকনিক্যাল কারণে বর্তমানে কোনো নতুন এন্ট্রি গ্রহণ করা হচ্ছে না।
            </p>
          </div>

          {/* Divider */}
          <div className="w-12 h-1 bg-slate-100 rounded-full my-8"></div>

          <p className="mt-8 text-xs text-slate-400 font-medium uppercase tracking-widest">
            Status: Inactive
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 font-sans antialiased text-slate-900">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 w-full max-w-3xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">গাড়ীর এন্ট্রি ফরম</h1>
            <p className="text-emerald-50 text-sm font-medium uppercase tracking-widest opacity-80">
              Vehicle Entry Registration
            </p>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Vehicle Information */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <Truck className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">গাড়ীর তথ্য</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">গাড়ীর ধরণ *</label>
                  <div className="flex gap-4">
                    {['Bus', 'Microbus'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, vehicle_type: type }))}
                        className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.vehicle_type === type ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-50' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200'}`}
                      >
                        <span className="font-bold">{type === 'Bus' ? 'বাস (Bus)' : 'মাইক্রো (Micro)'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">গাড়ীর নাম্বার *</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      name="vehicle_number"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-emerald-200 transition-all" 
                      placeholder="উদাঃ ঢাকা মেট্রো-ব ১১-২২৩৩" 
                      value={formData.vehicle_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Contact */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <User className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">যোগাযোগের তথ্য</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">প্রতিনিধির নাম *</label>
                  <input 
                    name="representative_name"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all" 
                    placeholder="নাম লিখুন" 
                    value={formData.representative_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">মোবাইল নাম্বার *</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      name="representative_mobile"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all" 
                      placeholder="017XXXXXXXX" 
                      value={formData.representative_mobile}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Address */}
            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">ঠিকানা</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-3">বিভাগ নির্বাচন করুন *</label>
                  <div className="flex flex-wrap gap-2">
                    {divisions.map((d) => (
                      <button 
                        key={d} 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, division: d }))} 
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${formData.division === d ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  name="district"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all bg-white" 
                  placeholder="জেলা *" 
                  value={formData.district}
                  onChange={handleInputChange}
                />
                <input 
                  name="thana"
                  required
                  className="md:col-span-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all bg-white" 
                  placeholder="থানা *" 
                  value={formData.thana}
                  onChange={handleInputChange}
                />
              </div>
            </section>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? <LoaderCircle className="animate-spin" size={22} /> : <><Send size={20} /> জমা দিন</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleEntryForm;