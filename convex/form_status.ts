import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const status = await ctx.db.query("show_form").first();
    if (!status) return true; // Default to true if not set
    return status.show_form;
  },
});

export const toggle = mutation({
  args: { show: v.boolean() },
  handler: async (ctx, args) => {
    const status = await ctx.db.query("show_form").first();
    if (status) {
      await ctx.db.patch(status._id, { show_form: args.show });
    } else {
      await ctx.db.insert("show_form", { show_form: args.show });
    }
  },
});
