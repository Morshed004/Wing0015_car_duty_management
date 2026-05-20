import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    vehicle_type: v.union(v.literal("Bus"), v.literal("Microbus")),
    vehicle_number: v.string(),
    representative_name: v.string(),
    representative_mobile: v.string(),
    driver_mobile: v.optional(v.string()),
    division: v.string(),
    district: v.string(),
    thana: v.string(),
    position: v.string(),
  },

  handler: async (ctx, args) => {
    // Trim all string values
    const cleanedData = {
      ...args,
      vehicle_number: args.vehicle_number.trim(),
      representative_name: args.representative_name.trim(),
      representative_mobile: args.representative_mobile.trim(),
      driver_mobile: args.driver_mobile?.trim(),
      division: args.division.trim(),
      district: args.district.trim(),
      thana: args.thana.trim(),
      position: args.position.trim(),
    };

    // Check if vehicle number already exists
    const existingVehicle = await ctx.db
      .query("entry")
      .withIndex("by_vehicle_number", (q) =>
        q.eq("vehicle_number", cleanedData.vehicle_number)
      )
      .first();

    if (existingVehicle) {
      throw new Error(
        `গাড়ীর নাম্বার "${cleanedData.vehicle_number}" ইতিমধ্যে রেজিস্ট্রেশন করা আছে`
      );
    }

    const entryId = await ctx.db.insert("entry", cleanedData);

    return entryId;
  },
});

export const checkVehicleNumber = query({
  args: { vehicle_number: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("entry")
      .withIndex("by_vehicle_number", (q) => 
        q.eq("vehicle_number", args.vehicle_number)
      )
      .first();
    return !!existing;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("entry").order("desc").collect();
  },
});