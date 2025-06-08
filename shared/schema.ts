import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fiscalCode: text("fiscal_code").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthDate: text("birth_date").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const licenseApplications = pgTable("license_applications", {
  id: serial("id").primaryKey(),
  practiceNumber: text("practice_number").notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licenseType: text("license_type").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_review, approved, rejected
  documents: text("documents").array().default([]),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  notes: text("notes"),
});

export const licenseRenewals = pgTable("license_renewals", {
  id: serial("id").primaryKey(),
  practiceNumber: text("practice_number").notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currentLicenseNumber: text("current_license_number").notNull(),
  expiryDate: text("expiry_date").notNull(),
  status: text("status").notNull().default("pending"),
  documents: text("documents").array().default([]),
  medicalCertificate: text("medical_certificate"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  officeLocation: text("office_location").notNull(),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  serviceType: text("service_type").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const licenseStatus = pgTable("license_status", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  points: integer("points").notNull().default(20),
  expiryDate: text("expiry_date").notNull(),
  isValid: boolean("is_valid").notNull().default(true),
  violations: text("violations").array().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLicenseApplicationSchema = createInsertSchema(licenseApplications).omit({
  id: true,
  practiceNumber: true,
  submittedAt: true,
  updatedAt: true,
});

export const insertLicenseRenewalSchema = createInsertSchema(licenseRenewals).omit({
  id: true,
  practiceNumber: true,
  submittedAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertLicenseStatusSchema = createInsertSchema(licenseStatus).omit({
  id: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type LicenseApplication = typeof licenseApplications.$inferSelect;
export type InsertLicenseApplication = z.infer<typeof insertLicenseApplicationSchema>;

export type LicenseRenewal = typeof licenseRenewals.$inferSelect;
export type InsertLicenseRenewal = z.infer<typeof insertLicenseRenewalSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type LicenseStatus = typeof licenseStatus.$inferSelect;
export type InsertLicenseStatus = z.infer<typeof insertLicenseStatusSchema>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  licenseApplications: many(licenseApplications),
  licenseRenewals: many(licenseRenewals),
  appointments: many(appointments),
  licenseStatus: many(licenseStatus),
}));

export const licenseApplicationsRelations = relations(licenseApplications, ({ one }) => ({
  user: one(users, {
    fields: [licenseApplications.userId],
    references: [users.id],
  }),
}));

export const licenseRenewalsRelations = relations(licenseRenewals, ({ one }) => ({
  user: one(users, {
    fields: [licenseRenewals.userId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}));

export const licenseStatusRelations = relations(licenseStatus, ({ one }) => ({
  user: one(users, {
    fields: [licenseStatus.userId],
    references: [users.id],
  }),
}));
