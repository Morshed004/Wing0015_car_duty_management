"use client";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import {
  ClipboardX,
  Hash,
  LoaderCircle,
  MapPin,
  Send,
  Smartphone,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// বাংলাদেশের সম্পূর্ণ বিভাগ, জেলা ও থানার ডেটা
const bangladeshData: Record<string, Record<string, string[]>> = {
  "ঢাকা": {
    "ঢাকা": ["ঢাকা সদর", "ধামরাই", "দোহার", "নবাবগঞ্জ", "কেরাণীগঞ্জ", "সাভার"],
    "গাজীপুর": ["গাজীপুর সদর", "কালিয়াকৈর", "শ্রীপুর", "কাপাসিয়া", "কালীগঞ্জ"],
    "কিশোরগঞ্জ": ["কিশোরগঞ্জ সদর", "হোসেনপুর", "পাকুন্দিয়া", "তাড়াইল", "করিমগঞ্জ", "কটিয়াদী", "ভৈরব", "কুলিয়ারচর", "বাজিতপুর", "ইটনা", "মিঠামইন", "অষ্টগ্রাম", "নিকলী"],
    "টাঙ্গাইল": ["টাঙ্গাইল সদর", "বাসাইল", "সখিপুর", "মির্জাপুর", "নাগরপুর", "দেলদুয়ার", "মধুপুর", "ধনবাড়ী", "ঘাটাইল", "কালিহাতী", "গোপালপুর", "ভুয়াপুর"],
    "মুন্সীগঞ্জ": ["মুন্সীগঞ্জ সদর", "টংগীবাড়ী", "শ্রীনগর", "সিরাজদীখান", "লৌহজং", "গজারিয়া"],
    "মানিকগঞ্জ": ["মানিকগঞ্জ সদর", "সিঙ্গাইর", "সাটুরিয়া", "হরিরামপুর", "শিবালয়", "ঘিওর", "দৌলতপুর"],
    "নারায়ণগঞ্জ": ["নারায়ণগঞ্জ সদর", "বন্দর", "সোনারগাঁও", "রূপগঞ্জ", "আড়াইহাজার"],
    "নরসিংদী": ["নরসিংদী সদর", "পলাশ", "শিবপুর", "মনোহরদী", "বেলাব", "রায়পুরা"],
    "ফরিদপুর": ["ফরিদপুর সদর", "বোয়ালমারী", "আলফাডাঙ্গা", "মধুখালী", "ভাঙ্গা", "নগরকান্দা", "চরভদ্রাসন", "সদরপুর", "সালথা"],
    "গোপালগঞ্জ": ["গোপালগঞ্জ সদর", "মুকসুদপুর", "কাশিয়ানী", "কোটালীপাড়া", "টুঙ্গিপাড়া"],
    "মাদারীপুর": ["মাদারীপুর সদর", "শিবচর", "কালকিনি", "রাজৈর", "ডাসার"],
    "রাজবাড়ী": ["রাজবাড়ী সদর", "গোয়ালন্দ", "পাংশা", "বালিয়াকান্দি", "কালুখালী"],
    "শরীয়তপুর": ["শরীয়তপুর সদর", "জাজিরা", "নড়িয়া", "ভেদরগঞ্জ", "ডামুড্যা", "গোসাইরহাট"]
  },
  "চট্টগ্রাম": {
    "চট্টগ্রাম": ["চট্টগ্রাম সদর", "সীতাকুণ্ড", "মিরসরাই", "ফটিকছড়ি", "হাটহাজারী", "রাউজান", "রাঙ্গুনিয়া", "বোয়ালখালী", "আনোয়ারা", "পটিয়া", "চন্দনাইশ", "সাতকানিয়া", "লোহাগাড়া", "বাঁশখালী", "কর্ণফুলী", "সন্দ্বীপ"],
    "কক্সবাজার": ["কক্সবাজার সদর", "রামু", "উখিয়া", "টেকনাফ", "চকোরিয়া", "পেকুয়া", "কুতুবদিয়া", "মহেশখালী"],
    "রাঙ্গামাটি": ["রাঙ্গামাটি সদর", "কাউখালী", "নানিয়ারচর", "বরকল", "জুরাছড়ি", "বাঘাইছড়ি", "লংগদু", "বলাইছড়ি", "কাপ্তাই", "রাজস্থলী"],
    "বান্দরবান": ["বান্দরবান সদর", "রোয়াংছড়ি", "রুমা", "থানচি", "লামা", "আলীকদম", "নাইক্ষ্যংছড়ি"],
    "খাগড়াছড়ি": ["খাগড়াছড়ি সদর", "দীঘিনালা", "পানছড়ি", "মহালছড়ি", "মাটিরাঙ্গা", "গুইমারা", "রামগড়", "মানিকছড়ি", "লক্ষ্মীছড়ি"],
    "ফেনী": ["ফেনী সদর", "দাগনভূঞা", "সোনাগাজী", "ছাগলনাইয়া", "পরশুরাম", "ফুলগাজী"],
    "নোয়াখালী": ["নোয়াখালী সদর", "বেগমগঞ্জ", "সেনবাগ", "কোম্পানীগঞ্জ", "চাটখিল", "সোনাইমুড়ী", "সুবর্ণচর", "কবিরহাট", "হাতিয়া"],
    "লক্ষ্মীপুর": ["লক্ষ্মীপুর সদর", "রামগঞ্জ", "রায়পুর", "কমলনগর", "রামগতি"],
    "কুমিল্লা": ["কুমিল্লা সদর", "চৌদ্দগ্রাম", "লাকসাম", "বরুড়া", "নাঙ্গলকোট", "ব্রাহ্মণপাড়া", "বুড়িচং", "দেবীদ্বার", "মুরাদনগর", "হোমনা", "মেঘনা", "তিতাস", "দাউদকান্দি", "মতলব", "মনোহরগঞ্জ", "লালমাই", "সদর দক্ষিণ"],
    "ব্রাহ্মণবাড়িয়া": ["ব্রাহ্মণবাড়িয়া সদর", "আশুগঞ্জ", "সরাইল", "নাসিরনগর", "নবীনগর", "বাঞ্ছারামপুর", "কসবা", "আখাউড়া", "বিজয়নগর"],
    "চাঁদপুর": ["চাঁদপুর সদর", "ফরিদগঞ্জ", "হাজীগঞ্জ", "শাহরাস্তি", "কচুয়া", "মতলব উত্তর", "মতলব দক্ষিণ", "হাইমচর"]
  },
  "রাজশাহী": {
    "রাজশাহী": ["রাজশাহী সদর", "গোদাগাড়ী", "তানোর", "মোহনপুর", "বাগমারা", "দুর্গাপুর", "পুঠিয়া", "চারঘাট", "বাঘা"],
    "নাটোর": ["নাটোর সদর", "সিংড়া", "বড়াইগ্রাম", "গুরুদাসপুর", "লালপুর", "বাগাতিপাড়া", "নলডাঙ্গা"],
    "নওগাঁ": ["নওগাঁ সদর", "মহাদেবপুর", "বদলগাছী", "পত্নীতলা", "ধামইরহাট", "সাপাহার", "পোরশা", "মান্দা", "আত্রাই", "রাণীনগর", "নিয়ামতপুর"],
    "চাঁপাইনবাবগঞ্জ": ["চাঁপাইনবাবগঞ্জ সদর", "শিবগঞ্জ", "গোমস্তাপুর", "নাচোল", "ভোলাহাট"],
    "পাবনা": ["পাবনা সদর", "ঈশ্বরদী", "সাঁথিয়া", "সুজানগর", "বেড়া", "চাটমোহর", "ফরিদপুর", "ভাঙ্গুরা", "আটঘরিয়া"],
    "সিরাজগঞ্জ": ["সিরাজগঞ্জ সদর", "কাজীপুর", "রায়গঞ্জ", "তাড়াশ", "উল্লাপাড়া", "শাহজাদপুর", "বেলকুচি", "কামারখন্দ", "চৌহালী"],
    "বগুড়া": ["বগুড়া সদর", "শাজাহানপুর", "শেরপুর", "ধুনট", "সারিয়াকান্দি", "গাবতলী", "সোনাতলা", "শিবগঞ্জ", "কাহালু", "নন্দীগ্রাম", "আদমদীঘি", "দুপচাঁচিয়া"],
    "জয়পুরহাট": ["জয়পুরহাট সদর", "পাঁচবিবি", "আক্কেলপুর", "কালাই", "ক্ষেতলাল"]
  },
  "খুলনা": {
    "খুলনা": ["খুলনা সদর", "দিঘলিয়া", "রূপসা", "তেরখাদা", "ফুলতলা", "ডুমুরিয়া", "বটিয়াঘাটা", "দাকোপ", "পাইকগাছা", "কয়রা"],
    "বাগেরহাট": ["বাগেরহাট সদর", "ফকিরহাট", "মোল্লাহাট", "চিতলমারী", "কচুয়া", "মোড়েলগঞ্জ", "শরণখোলা", "রামপাল", "মোংলা"],
    "সাতক্ষীরা": ["সাতক্ষীরা সদর", "কলারোয়া", "তালা", "আশাশুনি", "দেবহাটা", "কালীগঞ্জ", "শ্যামনগর"],
    "যশোর": ["যশোর সদর", "ঝিকরগাছা", "শার্শা", "চৌগাছা", "বাঘারপাড়া", "অভয়নগর", "মণিরামপুর", "কেশবপুর"],
    "মাগুরা": ["মাগুরা সদর", "শ্রীপুর", "মহম্মদপুর", "শালিখা"],
    "নড়াইল": ["নড়াইল সদর", "লোহাগড়া", "কালিয়া"],
    "কুষ্টিয়া": ["কুষ্টিয়া সদর", "কুমারখালী", "খোকসা", "মিরপুর", "ভেড়ামারা", "দৌলতপুর"],
    "চুয়াডাঙ্গা": ["চুয়াডাঙ্গা সদর", "আলমডাঙ্গা", "দামুড়হুদা", "জীবননগর"],
    "মেহেরপুর": ["মেহেরপুর সদর", "গাংনী", "মুজিবনগর"],
    "ঝিনাইদহ": ["ঝিনাইদহ সদর", "শৈলকুপা", "হরিণাকুণ্ডু", "কালীগঞ্জ", "কোটচাঁদপুর", "মহেশপুর"]
  },
  "বরিশাল": {
    "বরিশাল": ["বরিশাল সদর", "বাবুগঞ্জ", "উজিরপুর", "বানারীপাড়া", "গৌরনদী", "আগৈলঝাড়া", "বাকেরগঞ্জ", "হিজলা", "মুলাদী", "মেহেন্দিগঞ্জ"],
    "পটুয়াখালী": ["পটুয়াখালী সদর", "বাউফল", "দশমিনা", "গলাচিপা", "কলাপাড়া", "মির্জাগঞ্জ", "দুমকি", "রাঙ্গাবালী"],
    "ভোলা": ["ভোলা সদর", "দৌলতখান", "বোরহানউদ্দিন", "তজুমদ্দিন", "লালমোহন", "চরফ্যাশন", "মনপুরা"],
    "পিরোজপুর": ["পিরোজপুর সদর", "কাউখালী", "ভান্ডারিয়া", "মঠবাড়িয়া", "নাজিরপুর", "নেছারাবাদ", "ইন্দুরকানী"],
    "ঝালকাঠি": ["ঝালকাঠি সদর", "নলছিটি", "রাজাপুর", "কাঁঠালিয়া"],
    "বরগুনা": ["বরগুনা সদর", "আমতলী", "পাথরঘাটা", "বেতাগী", "বামনা", "তালতলী"]
  },
  "সিলেট": {
    "সিলেট": ["সিলেট সদর", "দক্ষিণ সুরমা", "বিশ্বনাথ", "ওসমানীনগর", "বালাগঞ্জ", "গোলাপগঞ্জ", "বিয়ানীবাজার", "জকিগঞ্জ", "কানাইঘাট", "জৈন্তাপুর", "গোয়াইনঘাট", "কোম্পানীগঞ্জ", "ফেঞ্চুগঞ্জ"],
    "সুনামগঞ্জ": ["সুনামগঞ্জ সদর", "ছাতক", "দোয়ারাবাজার", "বিশ্বম্ভরপুর", "তাহিরপুর", "জামালগঞ্জ", "ধর্মপাশা", "শাল্লা", "দিরাই", "জগন্নাথপুর", "দক্ষিণ সুনামগঞ্জ", "মধ্যনগর"],
    "মৌলভীবাজার": ["মৌলভীবাজার সদর", "রাজনগর", "কুলাউড়া", "জুড়ী", "বড়লেখা", "কমলগঞ্জ", "শ্রীমঙ্গল"],
    "হবিগঞ্জ": ["হবিগঞ্জ সদর", "নবীগঞ্জ", "আজমিরীগঞ্জ", "বানিয়াচং", "লাখাই", "চুনারুঘাট", "মাধবপুর", "বাহুবল", "শায়েস্তাগঞ্জ"]
  },
  "রংপুর": {
    "রংপুর": ["রংপুর সদর", "গঙ্গাচড়া", "তারাগঞ্জ", "বদরগঞ্জ", "মিঠাপুকুর", "পীরগঞ্জ", "কাউনিয়া", "পীরগাছা"],
    "দিনাজপুর": ["দিনাজপুর সদর", "বিরল", "বোচাগঞ্জ", "কাহারোল", "বীরগঞ্জ", "খানসামা", "চিরিরবন্দর", "পার্বতীপুর", "ফুলবাড়ী", "নবাবগঞ্জ", "বিরামপুর", "হাকিমপুর", "ঘোড়াঘাট"],
    "পঞ্চগড়": ["পঞ্চগড় সদর", "বোদা", "দেবীগঞ্জ", "আটোয়ারী", "তেঁতুলিয়া"],
    "ঠাকুরগাঁও": ["ঠাকুরগাঁও সদর", "পীরগঞ্জ", "বালিয়াডাঙ্গী", "হরিপুর", "রাণীশংকৈল"],
    "গাইবান্ধা": ["গাইবান্ধা সদর", "সাদুল্লাপুর", "পলাশবাড়ী", "গোবিন্দগঞ্জ", "সাঘাটা", "ফুলছড়ি", "সুন্দরগঞ্জ"],
    "কুড়িগ্রাম": ["কুড়িগ্রাম সদর", "নাগেশ্বরী", "ভুরুঙ্গামারী", "ফুলবাড়ী", "রাজারহাট", "উলিপুর", "চিলমারী", "রৌমারী", "রাজীবপুর"],
    "নীলফামারী": ["নীলফামারী সদর", "সৈয়দপুর", "জলঢাকা", "কিশোরগঞ্জ", "ডোমার", "ডিমলা"],
    "লালমনিরহাট": ["লালমনিরহাট সদর", "আদিতমারী", "কালীগঞ্জ", "হাতীবান্ধা", "পাটগ্রাম"]
  },
  "ময়মনসিংহ": {
    "ময়মনসিংহ": ["ময়মনসিংহ সদর", "মুক্তাগাছা", "ভালুকা", "ত্রিশাল", "ফুলবাড়িয়া", "গফরগাঁও", "নান্দাইল", "ফুলপুর", "হালুয়াঘাট", "ঈশ্বরগঞ্জ", "ধোবাউড়া", "গৌরীপুর", "তারাকান্দা"],
    "জামালপুর": ["জামালপুর সদর", "মেলান্দহ", "ইসলামপুর", "দেওয়ানগঞ্জ", "সরিষাবাড়ী", "মাদারগঞ্জ", "বকশীগঞ্জ"],
    "শেরপুর": ["শেরপুর সদর", "নকলা", "শ্রীবরদী", "ঝিনাইগাতী", "নালিতাবাড়ী"],
    "নেত্রকোণা": ["নেত্রকোণা সদর", "কেন্দুয়া", "মোহনগঞ্জ", "খালিয়াজুরী", "মদন", "কলমাকান্দা", "দুর্গাপুর", "পূর্বধলা", "বারহাট্টা", "আটপাড়া"]
  }
};

// Define the validation schema with Zod
const vehicleEntrySchema = z.object({
  vehicle_type: z.enum<readonly ["Bus", "Microbus"]>(["Bus", "Microbus"]),
  vehicle_number: z
    .string().trim()
    .min(1, "গাড়ীর নাম্বার প্রয়োজন")
    .min(5, "গাড়ীর নাম্বার কমপক্ষে ৫ অক্ষরের হতে হবে")
    .trim(), 
  representative_name: z
    .string().trim()
    .min(1, "প্রতিনিধির নাম প্রয়োজন")
    .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  representative_mobile: z
    .string().trim()
    .min(1, "মোবাইল নাম্বার প্রয়োজন")
    .regex(/^01[3-9]\d{8}$/, "সঠিক মোবাইল নাম্বার দিন (উদা: 017XXXXXXXX)"),
  driver_mobile: z
    .string().trim()
    .optional()
    .refine((val) => !val || /^01[3-9]\d{8}$/.test(val), {
      message: "সঠিক ড্রাইভারের মোবাইল নাম্বার দিন (উদা: 017XXXXXXXX)",
    }),
  division: z.string().trim().min(1, "বিভাগ নির্বাচন করুন"),
  district: z.string().trim().min(1, "জেলা প্রয়োজন"),
  thana: z.string().trim().min(1, "থানা প্রয়োজন"),
  position: z.string().trim().min(1, "পার্কিং এর স্থান নির্বাচন করুন"),
});

type VehicleEntryFormData = z.infer<typeof vehicleEntrySchema>;

const VehicleEntryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFormActive = useQuery(api.form_status.get);
  const createEntry = useMutation(api.entries.create);
  const positionData = useQuery(api.parkingPosition.getPositions);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    watch,
    trigger,
    reset,
    setError,
  } = useForm<VehicleEntryFormData>({
    resolver: zodResolver(vehicleEntrySchema),
    defaultValues: {
      vehicle_type: "Bus",
      vehicle_number: "",
      representative_name: "",
      representative_mobile: "",
      driver_mobile: "",
      division: "",
      district: "",
      thana: "",
      position: "",
    },
    mode: "onChange",
  });

  const vehicleNumber = watch("vehicle_number");
  const vehicleExists = useQuery(
    api.entries.checkVehicleNumber,
    vehicleNumber && vehicleNumber.length >= 5
      ? { vehicle_number: vehicleNumber }
      : "skip",
  );
  
  const vehicleType = watch("vehicle_type");
  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");

  const divisions = Object.keys(bangladeshData);
  const availableDistricts = selectedDivision ? Object.keys(bangladeshData[selectedDivision] || {}) : [];
  const availableThanas = (selectedDivision && selectedDistrict && bangladeshData[selectedDivision]?.[selectedDistrict]) 
    ? bangladeshData[selectedDivision][selectedDistrict] 
    : [];

  useEffect(() => {
    if (vehicleExists === undefined) return;

    if (vehicleExists === true) {
      setError("vehicle_number", {
        type: "manual",
        message: "এই গাড়ীর নাম্বারটি ইতিমধ্যে রেজিস্ট্রেশন করা আছে",
      });
    }

    if (vehicleExists === false) {
      trigger("vehicle_number");
    }
  }, [vehicleExists, setError, trigger]);

  const onSubmit = async (data: VehicleEntryFormData) => {
    setIsSubmitting(true);

    try {
      await createEntry(data);
      toast.success("গাড়ীর তথ্য সফলভাবে জমা দেওয়া হয়েছে!");
      reset();
    } catch {
      toast.error("দুঃখিত, তথ্য জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
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
              <LoaderCircle
                className="animate-spin text-emerald-600"
                size={40}
                strokeWidth={1.5}
              />
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
              <ClipboardX
                className="text-slate-400"
                size={48}
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className="space-y-3 text-center">
            <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">
              ফরমটি বর্তমানে বন্ধ আছে
            </h3>
            <p className="text-slate-500 leading-relaxed font-light">
              দুঃখিত, নির্ধারিত সময় অতিক্রান্ত হওয়ায় কারণে বর্তমানে কোনো নতুন
              এন্ট্রি গ্রহণ করা হচ্ছে না।
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
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              গাড়ীর এন্ট্রি ফরম
            </h1>
            <p className="text-emerald-50 text-sm font-medium uppercase tracking-widest opacity-80">
              Vehicle Entry Registration
            </p>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="p-6 md:p-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-10"
            noValidate
          >
            {/* Section 1: Vehicle Information */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <Truck className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">গাড়ীর তথ্য</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    গাড়ীর ধরণ *
                  </label>
                  <div className="flex gap-4">
                    {["Bus", "Microbus"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setValue("vehicle_type", type as "Bus" | "Microbus");
                          trigger("vehicle_type");
                        }}
                        className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 transition-all ${vehicleType === type ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-50" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200"}`}
                      >
                        <span className="font-bold">
                          {type === "Bus" ? "বাস (Bus)" : "মাইক্রো (Micro)"}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.vehicle_type && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.vehicle_type.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    গাড়ীর নাম্বার *
                  </label>
                  <div className="relative">
                    <Hash
                      className="absolute left-4 top-3.5 text-slate-400"
                      size={18}
                    />
                    <input
                      {...register("vehicle_number")}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all ${errors.vehicle_number ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"}`}
                      placeholder="উদাঃ ঢাকা মেট্রো-ব ১১-২২৩৩"
                    />
                  </div>
                  {errors.vehicle_number && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.vehicle_number.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: Contact */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <User className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">
                  যোগাযোগের তথ্য
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    প্রতিনিধির নাম *
                  </label>
                  <input
                    {...register("representative_name")}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${errors.representative_name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"}`}
                    placeholder="নাম লিখুন"
                  />
                  {errors.representative_name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.representative_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    মোবাইল নাম্বার *
                  </label>
                  <div className="relative">
                    <Smartphone
                      className="absolute left-4 top-3.5 text-slate-400"
                      size={18}
                    />
                    <input
                      {...register("representative_mobile")}
                      className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${errors.representative_mobile ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"}`}
                      placeholder="017XXXXXXXX"
                    />
                  </div>
                  {errors.representative_mobile && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.representative_mobile.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Address (Modified for Dependant Dropdowns) */}
            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">ঠিকানা</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-3">
                    বিভাগ নির্বাচন করুন *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {divisions.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          if (watch("division") !== d) {
                            setValue("division", d);
                            setValue("district", "");
                            setValue("thana", "");
                            trigger(["division", "district", "thana"]);
                          }
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${watch("division") === d ? "bg-emerald-600 border-emerald-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-400"}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.division && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.division.message}
                    </p>
                  )}
                </div>
                
                {/* District Dropdown */}
                <div>
                  <select
                    {...register("district", {
                      onChange: () => {
                        // Reset thana when district changes
                        setValue("thana", "");
                        trigger("thana");
                      }
                    })}
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all bg-white ${errors.district ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"}`}
                    disabled={!selectedDivision}
                  >
                    <option value="">জেলা নির্বাচন করুন *</option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.district.message}
                    </p>
                  )}
                </div>

                {/* Thana Dropdown */}
                <div className="md:col-span-2">
                  <select
                    {...register("thana")}
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all bg-white ${errors.thana ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"}`}
                    disabled={!selectedDistrict}
                  >
                    <option value="">থানা নির্বাচন করুন *</option>
                    {availableThanas.map((thana) => (
                      <option key={thana} value={thana}>
                        {thana}
                      </option>
                    ))}
                  </select>
                  {errors.thana && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.thana.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-3">
                  পার্কিং এর স্থান নির্বাচন করুন *
                </label>
                <div className="flex flex-wrap gap-2">
                  {positionData?.map((d) => (
                    <button
                      key={d._id}
                      type="button"
                      onClick={() => {
                        setValue("position", d.position);
                        trigger("position");
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${watch("position") === d.position ? "bg-emerald-600 border-emerald-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-400"}`}
                    >
                      {d.position}
                    </button>
                  ))}
                </div>
              </div>
              {errors.position && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.position?.message}
                </p>
              )}
            </div>

            {/* Optional Driver Mobile Field */}
            <section>
              <div className="relative">
                <Smartphone
                  className="absolute left-4 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  {...register("driver_mobile")}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  placeholder="ড্রাইভারের মোবাইল (ঐচ্ছিক)"
                />
              </div>
              {errors.driver_mobile && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.driver_mobile.message}
                </p>
              )}
            </section>

            <button
              type="submit"
              disabled={isSubmitting || !isDirty || !isValid}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" size={22} />
              ) : (
                <>
                  <Send size={20} /> জমা দিন
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleEntryForm;