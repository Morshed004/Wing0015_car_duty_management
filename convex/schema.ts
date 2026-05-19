import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  entry: defineTable({
    // Convex enums are defined as an array of strings
    vehicle_type: v.union(v.literal("Bus"), v.literal("Microbus")),
    vehicle_number: v.string(),
    representative_name: v.string(),
    representative_mobile: v.string(),
    // Keep optional fields as they are
    driver_mobile: v.optional(v.string()),
    division: v.string(),
    district: v.string(),
    thana: v.string(),
  }).index("by_vehicle_number", ["vehicle_number"]),

  parking_position: defineTable({
    position: v.string(),
  }),

  show_form: defineTable({
    show_form: v.boolean(),
  }),
});
