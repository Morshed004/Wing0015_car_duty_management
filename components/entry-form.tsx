"use client"
import { api } from '@/convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Define the validation schema with Zod
const vehicleEntrySchema = z.object({
  vehicle_type: z.enum<readonly ['Bus', 'Microbus']>(['Bus', 'Microbus']),
  vehicle_number: z.string()
    .min(1, "গাড়ীর নাম্বার প্রয়োজন")
    .min(5, "গাড়ীর নাম্বার কমপক্ষে ৫ অক্ষরের হতে হবে").trim(), // Optional: Add format validation
  representative_name: z.string()
    .min(1, "প্রতিনিধির নাম প্রয়োজন")
    .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  representative_mobile: z.string()
    .min(1, "মোবাইল নাম্বার প্রয়োজন")
    .regex(/^01[3-9]\d{8}$/, "সঠিক মোবাইল নাম্বার দিন (উদা: 017XXXXXXXX)"),
  driver_mobile: z.string()
    .optional()
    .refine((val) => !val || /^01[3-9]\d{8}$/.test(val), {
      message: "সঠিক ড্রাইভারের মোবাইল নাম্বার দিন (উদা: 017XXXXXXXX)",
    }),
  division: z.string()
    .min(1, "বিভাগ নির্বাচন করুন"),
  district: z.string()
    .min(1, "জেলা প্রয়োজন"),
  thana: z.string()
    .min(1, "থানা প্রয়োজন"),
});

type VehicleEntryFormData = z.infer<typeof vehicleEntrySchema>;

const VehicleEntryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_isCheckingNumber, setIsCheckingNumber] = useState(false);
  const [_vehicleNumberError, setVehicleNumberError] = useState<string | null>(null);
  
  const isFormActive = useQuery(api.form_status.get);
  const createEntry = useMutation(api.entries.create);
  

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    watch,
    trigger,
    reset,
    setError,
    clearErrors
  } = useForm<VehicleEntryFormData>({
    resolver: zodResolver(vehicleEntrySchema),
    defaultValues: {
      vehicle_type: 'Bus',
      vehicle_number: '',
      representative_name: '',
      representative_mobile: '',
      driver_mobile: '',
      division: '',
      district: '',
      thana: '',
    },
    mode: 'onChange',
  });

  const vehicleNumber = watch('vehicle_number');
  const vehicleExists = useQuery(
  api.entries.checkVehicleNumber,
  vehicleNumber && vehicleNumber.length >= 5
    ? { vehicle_number: vehicleNumber }
    : "skip"
);
  const vehicleType = watch('vehicle_type');
  const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

  useEffect(() => {
  if (vehicleExists === undefined) return;

  if (vehicleExists) {
    setVehicleNumberError("এই গাড়ীর নাম্বারটি ইতিমধ্যে রেজিস্ট্রেশন করা আছে");

    setError('vehicle_number', {
      type: 'manual',
      message: "এই গাড়ীর নাম্বারটি ইতিমধ্যে রেজিস্ট্রেশন করা আছে"
    });
  } else {
    setVehicleNumberError(null);
    clearErrors('vehicle_number');
  }
}, [vehicleExists, setError, clearErrors]);

  const onSubmit = async (data: VehicleEntryFormData) => {
    setIsSubmitting(true);
    
    try {
      // Send data to Convex
      await createEntry(data);
      
      // Show success message (you can add a toast notification here)
      toast.success("গাড়ীর তথ্য সফলভাবে জমা দেওয়া হয়েছে!")
      
      // Reset form after successful submission
      reset();
      
    } catch {
      toast.error("দুঃখিত, তথ্য জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।")
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while fetching from database
  if (isFormActive === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
              <LoaderCircle className="animate-spin text-emerald-600" size={40} strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">
              Connecting to server
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If the form is closed
  if (!isFormActive) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-10 flex flex-col items-center transition-all hover:shadow-md">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
              <ClipboardX className="text-slate-400" size={48} strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-3 text-center">
            <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">
              ফরমটি বর্তমানে বন্ধ আছে
            </h3>
            <p className="text-slate-500 leading-relaxed font-light">
              দুঃখিত, নির্ধারিত সময় অতিক্রান্ত হওয়ায় কারণে বর্তমানে কোনো নতুন এন্ট্রি গ্রহণ করা হচ্ছে না।
            </p>
          </div>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
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
                        onClick={() => {
                          setValue('vehicle_type', type as 'Bus' | 'Microbus');
                          trigger('vehicle_type');
                        }}
                        className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 transition-all ${vehicleType === type ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-50' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200'}`}
                      >
                        <span className="font-bold">{type === 'Bus' ? 'বাস (Bus)' : 'মাইক্রো (Micro)'}</span>
                      </button>
                    ))}
                  </div>
                  {errors.vehicle_type && (
                    <p className="text-red-500 text-sm mt-2">{errors.vehicle_type.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">গাড়ীর নাম্বার *</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      {...register('vehicle_number')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all ${errors.vehicle_number ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                      placeholder="উদাঃ ঢাকা মেট্রো-ব ১১-২২৩৩"
                    />
                  </div>
                  {errors.vehicle_number && (
                    <p className="text-red-500 text-sm mt-2">{errors.vehicle_number.message}</p>
                  )}
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
                    {...register('representative_name')}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${errors.representative_name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                    placeholder="নাম লিখুন"
                  />
                  {errors.representative_name && (
                    <p className="text-red-500 text-sm mt-2">{errors.representative_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">মোবাইল নাম্বার *</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      {...register('representative_mobile')}
                      className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${errors.representative_mobile ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                      placeholder="017XXXXXXXX"
                    />
                  </div>
                  {errors.representative_mobile && (
                    <p className="text-red-500 text-sm mt-2">{errors.representative_mobile.message}</p>
                  )}
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
                        onClick={() => {
                          setValue('division', d);
                          trigger('division');
                        }} 
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${watch('division') === d ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.division && (
                    <p className="text-red-500 text-sm mt-2">{errors.division.message}</p>
                  )}
                </div>
                <div>
                  <input 
                    {...register('district')}
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all bg-white ${errors.district ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                    placeholder="জেলা *"
                  />
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-2">{errors.district.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <input 
                    {...register('thana')}
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all bg-white ${errors.thana ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                    placeholder="থানা *"
                  />
                  {errors.thana && (
                    <p className="text-red-500 text-sm mt-2">{errors.thana.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Optional Driver Mobile Field */}
            <section>
              <div className="relative">
                <Smartphone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  {...register('driver_mobile')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  placeholder="ড্রাইভারের মোবাইল (ঐচ্ছিক)"
                />
              </div>
              {errors.driver_mobile && (
                <p className="text-red-500 text-sm mt-2">{errors.driver_mobile.message}</p>
              )}
            </section>

            <button 
              type="submit" 
              disabled={isSubmitting || !isDirty || !isValid} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
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