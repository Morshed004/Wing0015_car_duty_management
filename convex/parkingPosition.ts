import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addPositions = mutation({
  args: {
    positions: v.string(),
  },

  handler: async (ctx, args) => {

    await ctx.db.insert("parking_position", {
      position: args.positions,
    });
  },
});

export const getPositions = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("parking_position")
      .collect();
  },
});

export const deletePosition = mutation({
  args: {
    id: v.id("parking_position"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
})