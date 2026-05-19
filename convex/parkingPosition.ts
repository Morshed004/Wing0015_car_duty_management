import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addPositions = mutation({
  args: {
    positions: v.string(),
  },

  handler: async (ctx, args) => {
    // existing document
    const existing = await ctx.db
      .query("parking_position")
      .first();

    // update
    if (existing) {
      await ctx.db.patch(existing._id, {
        position: args.positions,
      });

      return;
    }

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