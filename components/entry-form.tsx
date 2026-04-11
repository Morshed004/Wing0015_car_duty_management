"use client"
import { useForm } from '@tanstack/react-form';
import {
    Brush,
    Hash,
    LoaderCircle,
    MapPin,
    Send,
    Smartphone,
    Truck,
    User
} from 'lucide-react';
import React from 'react';
import { z } from 'zod';

const formSchema = z.object({
  vehicle_type: z.enum(['Bus', 'Microbus'], {
    required_error: 'গাড়ীর ধরণ নির্বাচন করুন',
  }),
  vehicle_number: z.string().min(1, 'গাড়ীর নাম্বার দিন').max(20, 'গাড়ীর নাম্বার খুব বড়'),
  representative_name: z.string().optional(),
  representative_mobile: z.string().min(11, 'সঠিক মোবাইল নাম্বার দিন').max(15),
  driver_mobile: z.string().optional(),
  division: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  district: z.string().min(1, 'জেলার নাম দিন'),
  thana: z.string().min(1, 'থানার নাম দিন'),
});

type FormData = z.infer<typeof formSchema>;

const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

const VehicleEntryForm: React.FC = () => {
  const form = useForm({
    defaultValues: {
      vehicle_type: 'Bus',
      vehicle_number: '',
      representative_name: '',
      representative_mobile: '',
      driver_mobile: '',
      division: '',
      district: '',
      thana: '',
    } as FormData,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('ফর্ম সফলভাবে জমা দেওয়া হয়েছে!');
      form.reset();
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 font-sans antialiased text-slate-900">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 w-full max-w-3xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">গাড়ীর এন্ট্রি ফরম</h1>
            <p className="text-emerald-50 text-sm font-medium uppercase tracking-widest opacity-80">
              Vehicle Entry Registration
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="p-6 md:p-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-10"
          >
            {/* Section 1: Vehicle Details */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <Truck className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">গাড়ীর তথ্য (Vehicle Info)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Type */}
                <form.Field name="vehicle_type">
                  {(field) => (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        গাড়ীর ধরণ <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        {['Bus', 'Microbus'].map((type) => (
                          <label
                            key={type}
                            className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              field.state.value === type
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-50'
                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200'
                            }`}
                          >
                            <input
                              type="radio"
                              className="sr-only"
                              checked={field.state.value === type}
                              onChange={() => field.handleChange(type as any)}
                            />
                            <span className="font-bold">{type === 'Bus' ? 'বাস (Bus)' : 'মাইক্রো (Micro)'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </form.Field>

                {/* Vehicle Number */}
                <form.Field name="vehicle_number">
                  {(field) => (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">গাড়ীর নাম্বার</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                          <Hash size={18} />
                        </div>
                        <input
                          className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                          placeholder="উদাঃ ঢাকা মেট্রো-ব ১১-২২৩৩"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </div>
                      {field.state.meta.errors && <p className="mt-2 text-xs text-rose-500 font-medium">{field.state.meta.errors}</p>}
                    </div>
                  )}
                </form.Field>
              </div>
            </section>

            {/* Section 2: Contact Details */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <User className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">যোগাযোগের তথ্য (Contact)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field name="representative_name">
                  {(field) => (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">প্রতিনিধির নাম</label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="নাম লিখুন"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="representative_mobile">
                  {(field) => (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">মোবাইল নাম্বার *</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                          placeholder="017XXXXXXXX"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </form.Field>
              </div>
            </section>

            {/* Section 3: Location */}
            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">ঠিকানা (Location)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <form.Field name="division">
                  {(field) => (
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">বিভাগ নির্বাচন করুন</label>
                        <div className="flex flex-wrap gap-2">
                            {divisions.map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => field.handleChange(d)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                        field.state.value === d 
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                  )}
                </form.Field>

                <form.Field name="district">
                    {(field) => (
                        <div className="md:col-span-1">
                            <input 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                                placeholder="জেলা" 
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </div>
                    )}
                </form.Field>
                <form.Field name="thana">
                    {(field) => (
                        <div className="md:col-span-2">
                            <input 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                                placeholder="থানা" 
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </div>
                    )}
                </form.Field>
              </div>
            </section>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
              
              <form.Subscribe selector={(state) => [state.isSubmitting]}>
                {([isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-80 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="animate-spin" size={22} />
                    ) : (
                      <>
                        <Send size={20} />
                        জমা দিন (Submit)
                      </>
                    )}
                  </button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleEntryForm;