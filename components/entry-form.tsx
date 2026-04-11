"use client"
import { useForm } from '@tanstack/react-form';
import {
  Hash,
  LoaderCircle,
  MapPin,
  Send,
  Smartphone,
  Truck,
  User,
  ClipboardX
} from 'lucide-react';
import React, { useState } from 'react';
import { z } from 'zod';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

// Schema with driver_mobile optional, all others required
const formSchema = z.object({
  vehicle_type: z.enum(['Bus', 'Microbus'], {
    message: 'গাড়ীর ধরণ নির্বাচন করুন',
  }),
  vehicle_number: z.string().min(1, 'গাড়ীর নাম্বার দিন').max(20, 'গাড়ীর নাম্বার খুব বড়'),
  representative_name: z.string().min(1, 'প্রতিনিধির নাম দিন'),
  representative_mobile: z.string()
    .min(11, 'মোবাইল নাম্বার কমপক্ষে ১১ ডিজিট হতে হবে')
    .max(15, 'মোবাইল নাম্বার ১৫ ডিজিটের বেশি হতে পারবে না'),
  driver_mobile: z.string().optional(),
  division: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  district: z.string().min(1, 'জেলার নাম দিন'),
  thana: z.string().min(1, 'থানার নাম দিন'),
});

type FormData = z.infer<typeof formSchema>;

const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

const VehicleEntryForm: React.FC = () => {
  const isFormActive = useQuery(api.form_status.get) ?? true;
  const createEntry = useMutation(api.entries.create);

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
      try {
        await createEntry(value);
        toast.success('সফল!', {
          description: 'ফর্ম সফলভাবে জমা দেওয়া হয়েছে!',
        });
        form.reset();
      } catch (error) {
        console.error('Failed to save entry:', error);
        toast.error('সমস্যা হয়েছে', {
          description: 'ফর্ম জমা দেওয়ায় সমস্যা হয়েছে।',
        });
      }
    },
  });

  // Helper function to safely get error message
  const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
    return 'ভুল তথ্য';
  };

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
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="p-6 md:p-10">
          {isFormActive ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-10"
            >
              {/* Section 1: Vehicle Details */}
              <section>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                  <Truck className="text-emerald-600" size={20} />
                  <h2 className="text-lg font-bold text-slate-800">গাড়ীর তথ্য</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <form.Field name="vehicle_type" validators={{ onChange: formSchema.shape.vehicle_type }}>
                    {(field) => (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">গাড়ীর ধরণ *</label>
                        <div className="flex gap-4">
                          {['Bus', 'Microbus'].map((type) => (
                            <label key={type} className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${field.state.value === type ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-50' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200'}`}>
                              <input type="radio" className="sr-only" checked={field.state.value === type} onChange={() => field.handleChange(type as any)} />
                              <span className="font-bold">{type === 'Bus' ? 'বাস (Bus)' : 'মাইক্রো (Micro)'}</span>
                            </label>
                          ))}
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-2 text-xs text-rose-500 font-medium">
                            {field.state.meta.errors.map((err, idx) => getErrorMessage(err)).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="vehicle_number" validators={{ onChange: formSchema.shape.vehicle_number }}>
                    {(field) => (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">গাড়ীর নাম্বার *</label>
                        <div className="relative">
                          <Hash className={`absolute left-4 top-3.5 ${field.state.meta.errors.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} size={18} />
                          <input className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all ${field.state.meta.errors.length > 0 ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200'}`} placeholder="উদাঃ ঢাকা মেট্রো-ব ১১-২২৩৩" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-1.5 text-xs text-rose-500 font-medium">
                            {field.state.meta.errors.map((err, idx) => getErrorMessage(err)).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </section>

              {/* Section 2: Contact Details */}
              <section>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                  <User className="text-emerald-600" size={20} />
                  <h2 className="text-lg font-bold text-slate-800">যোগাযোগের তথ্য</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <form.Field name="representative_name" validators={{ onChange: formSchema.shape.representative_name }}>
                    {(field) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">প্রতিনিধির নাম *</label>
                        <input className={`w-full px-4 py-3 bg-slate-50 border rounded-xl transition-all outline-none ${field.state.meta.errors.length > 0 ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`} placeholder="নাম লিখুন" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-1.5 text-xs text-rose-500 font-medium">
                            {field.state.meta.errors.map((err, idx) => getErrorMessage(err)).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="representative_mobile" validators={{ onChange: formSchema.shape.representative_mobile }}>
                    {(field) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">মোবাইল নাম্বার *</label>
                        <div className="relative">
                          <Smartphone className={`absolute left-4 top-3.5 ${field.state.meta.errors.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} size={18} />
                          <input className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${field.state.meta.errors.length > 0 ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`} placeholder="017XXXXXXXX" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-1.5 text-xs text-rose-500 font-medium">
                            {field.state.meta.errors.map((err, idx) => getErrorMessage(err)).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="driver_mobile" validators={{ onChange: formSchema.shape.driver_mobile }}>
                    {(field) => (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">ড্রাইভার মোবাইল নাম্বার</label>
                        <div className="relative">
                          <Smartphone className={`absolute left-4 top-3.5 ${field.state.meta.errors.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} size={18} />
                          <input className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${field.state.meta.errors.length > 0 ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`} placeholder="018XXXXXXXX (ঐচ্ছিক)" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-1.5 text-xs text-rose-500 font-medium">
                            {field.state.meta.errors.map((err, idx) => getErrorMessage(err)).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </section>

              {/* Section 3: Location */}
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="text-emerald-600" size={20} />
                  <h2 className="text-lg font-bold text-slate-800">ঠিকানা</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <form.Field name="division" validators={{ onChange: formSchema.shape.division }}>
                    {(field) => (
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-3">বিভাগ নির্বাচন করুন *</label>
                        <div className="flex flex-wrap gap-2">
                          {divisions.map((d) => (
                            <button key={d} type="button" onClick={() => field.handleChange(d)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${field.state.value === d ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400'}`}>
                              {d}
                            </button>
                          ))}
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-2 text-xs text-rose-500 font-medium">
                            {field.state.meta.errors.map((err, idx) => getErrorMessage(err)).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="district" validators={{ onChange: formSchema.shape.district }}>
                    {(field) => (
                      <div className="md:col-span-1">
                        <input className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${field.state.meta.errors.length > 0 ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`} placeholder="জেলা *" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-1.5 text-xs text-rose-500 font-medium">
                            {field.state.meta.errors.map((err, idx) => getErrorMessage(err)).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="thana" validators={{ onChange: formSchema.shape.thana }}>
                    {(field) => (
                      <div className="md:col-span-2">
                        <input className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${field.state.meta.errors.length > 0 ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`} placeholder="থানা *" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        {field.state.meta.errors.length > 0 && (
                          <p className="mt-1.5 text-xs text-rose-500 font-medium">
                            {field.state.meta.errors.map((err, idx) => getErrorMessage(err)).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
                <form.Subscribe selector={(state) => [state.isSubmitting]}>
                  {([isSubmitting]) => (
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-80 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70">
                      {isSubmitting ? <LoaderCircle className="animate-spin" size={22} /> : <><Send size={20} /> জমা দিন</>}
                    </button>
                  )}
                </form.Subscribe>
              </div>
            </form>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <ClipboardX className="text-slate-400" size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">ফরমটি বর্তমানে বন্ধ আছে</h3>
              <p className="text-slate-500 max-w-xs">দুঃখিত, বর্তমানে কোনো এন্ট্রি গ্রহণ করা হচ্ছে না।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleEntryForm;