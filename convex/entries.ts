import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    vehicle_type: v.union(v.literal('Bus'), v.literal('Microbus')),
    vehicle_number: v.string(),
    representative_name: v.string(),
    representative_mobile: v.string(),
    driver_mobile: v.optional(v.string()),
    division: v.string(),
    district: v.string(),
    thana: v.string(),
  },
  handler: async (ctx, args) => {
    const entryId = await ctx.db.insert("entry", args);
    return entryId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("entry").order("desc").collect();
  },
});

export const remove = mutation({
  args: { id: v.id("entry") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
