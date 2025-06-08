import {
  users,
  licenseApplications,
  licenseRenewals,
  appointments,
  licenseStatus,
  type User,
  type InsertUser,
  type LicenseApplication,
  type InsertLicenseApplication,
  type LicenseRenewal,
  type InsertLicenseRenewal,
  type Appointment,
  type InsertAppointment,
  type LicenseStatus,
  type InsertLicenseStatus,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByFiscalCode(fiscalCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // License application operations
  createLicenseApplication(application: InsertLicenseApplication): Promise<LicenseApplication>;
  getLicenseApplication(practiceNumber: string): Promise<LicenseApplication | undefined>;
  getLicenseApplicationsByUserId(userId: number): Promise<LicenseApplication[]>;
  updateLicenseApplicationStatus(practiceNumber: string, status: string, notes?: string): Promise<LicenseApplication | undefined>;

  // License renewal operations
  createLicenseRenewal(renewal: InsertLicenseRenewal): Promise<LicenseRenewal>;
  getLicenseRenewal(practiceNumber: string): Promise<LicenseRenewal | undefined>;
  getLicenseRenewalsByUserId(userId: number): Promise<LicenseRenewal[]>;
  updateLicenseRenewalStatus(practiceNumber: string, status: string): Promise<LicenseRenewal | undefined>;

  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByUserId(userId: number): Promise<Appointment[]>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;

  // License status operations
  getLicenseStatus(licenseNumber: string): Promise<LicenseStatus | undefined>;
  getLicenseStatusByUserId(userId: number): Promise<LicenseStatus | undefined>;
  createLicenseStatus(status: InsertLicenseStatus): Promise<LicenseStatus>;
  updateLicensePoints(licenseNumber: string, points: number): Promise<LicenseStatus | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private licenseApplications: Map<string, LicenseApplication>;
  private licenseRenewals: Map<string, LicenseRenewal>;
  private appointments: Map<number, Appointment>;
  private licenseStatuses: Map<string, LicenseStatus>;
  private currentUserId: number;
  private currentAppointmentId: number;
  private currentLicenseStatusId: number;

  constructor() {
    this.users = new Map();
    this.licenseApplications = new Map();
    this.licenseRenewals = new Map();
    this.appointments = new Map();
    this.licenseStatuses = new Map();
    this.currentUserId = 1;
    this.currentAppointmentId = 1;
    this.currentLicenseStatusId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFiscalCode(fiscalCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.fiscalCode === fiscalCode);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async createLicenseApplication(insertApplication: InsertLicenseApplication): Promise<LicenseApplication> {
    const practiceNumber = `PA${new Date().getFullYear()}${String(Date.now()).slice(-8)}`;
    const application: LicenseApplication = {
      ...insertApplication,
      id: Date.now(),
      practiceNumber,
      submittedAt: new Date(),
      updatedAt: new Date(),
      status: insertApplication.status || "In Elaborazione",
      documents: insertApplication.documents || null,
      notes: insertApplication.notes || null,
    };
    this.licenseApplications.set(practiceNumber, application);
    return application;
  }

  async getLicenseApplication(practiceNumber: string): Promise<LicenseApplication | undefined> {
    return this.licenseApplications.get(practiceNumber);
  }

  async getLicenseApplicationsByUserId(userId: number): Promise<LicenseApplication[]> {
    return Array.from(this.licenseApplications.values()).filter(app => app.userId === userId);
  }

  async updateLicenseApplicationStatus(practiceNumber: string, status: string, notes?: string): Promise<LicenseApplication | undefined> {
    const application = this.licenseApplications.get(practiceNumber);
    if (application) {
      application.status = status;
      application.updatedAt = new Date();
      if (notes) application.notes = notes;
      this.licenseApplications.set(practiceNumber, application);
    }
    return application;
  }

  async createLicenseRenewal(insertRenewal: InsertLicenseRenewal): Promise<LicenseRenewal> {
    const practiceNumber = `PR${new Date().getFullYear()}${String(Date.now()).slice(-8)}`;
    const renewal: LicenseRenewal = {
      ...insertRenewal,
      id: Date.now(),
      practiceNumber,
      submittedAt: new Date(),
      updatedAt: new Date(),
      status: insertRenewal.status || "In Elaborazione",
      documents: insertRenewal.documents || null,
      medicalCertificate: insertRenewal.medicalCertificate || null,
    };
    this.licenseRenewals.set(practiceNumber, renewal);
    return renewal;
  }

  async getLicenseRenewal(practiceNumber: string): Promise<LicenseRenewal | undefined> {
    return this.licenseRenewals.get(practiceNumber);
  }

  async getLicenseRenewalsByUserId(userId: number): Promise<LicenseRenewal[]> {
    return Array.from(this.licenseRenewals.values()).filter(renewal => renewal.userId === userId);
  }

  async updateLicenseRenewalStatus(practiceNumber: string, status: string): Promise<LicenseRenewal | undefined> {
    const renewal = this.licenseRenewals.get(practiceNumber);
    if (renewal) {
      renewal.status = status;
      renewal.updatedAt = new Date();
      this.licenseRenewals.set(practiceNumber, renewal);
    }
    return renewal;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      createdAt: new Date(),
      status: insertAppointment.status || "Programmato",
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => appointment.userId === userId);
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      appointment.status = status;
      this.appointments.set(id, appointment);
    }
    return appointment;
  }

  async getLicenseStatus(licenseNumber: string): Promise<LicenseStatus | undefined> {
    return this.licenseStatuses.get(licenseNumber);
  }

  async getLicenseStatusByUserId(userId: number): Promise<LicenseStatus | undefined> {
    return Array.from(this.licenseStatuses.values()).find(status => status.userId === userId);
  }

  async createLicenseStatus(insertStatus: InsertLicenseStatus): Promise<LicenseStatus> {
    const id = this.currentLicenseStatusId++;
    const status: LicenseStatus = {
      ...insertStatus,
      id,
      updatedAt: new Date(),
      points: insertStatus.points || 20,
      isValid: insertStatus.isValid !== undefined ? insertStatus.isValid : true,
      violations: insertStatus.violations || null,
    };
    this.licenseStatuses.set(insertStatus.licenseNumber, status);
    return status;
  }

  async updateLicensePoints(licenseNumber: string, points: number): Promise<LicenseStatus | undefined> {
    const status = this.licenseStatuses.get(licenseNumber);
    if (status) {
      status.points = points;
      status.updatedAt = new Date();
      this.licenseStatuses.set(licenseNumber, status);
    }
    return status;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByFiscalCode(fiscalCode: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.fiscalCode, fiscalCode));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createLicenseApplication(insertApplication: InsertLicenseApplication): Promise<LicenseApplication> {
    const practiceNumber = `PA${new Date().getFullYear()}${String(Date.now()).slice(-8)}`;
    const [application] = await db
      .insert(licenseApplications)
      .values({
        ...insertApplication,
        practiceNumber,
        status: insertApplication.status || "In Elaborazione",
        documents: insertApplication.documents || null,
        notes: insertApplication.notes || null,
      })
      .returning();
    return application;
  }

  async getLicenseApplication(practiceNumber: string): Promise<LicenseApplication | undefined> {
    const [application] = await db
      .select()
      .from(licenseApplications)
      .where(eq(licenseApplications.practiceNumber, practiceNumber));
    return application || undefined;
  }

  async getLicenseApplicationsByUserId(userId: number): Promise<LicenseApplication[]> {
    return await db
      .select()
      .from(licenseApplications)
      .where(eq(licenseApplications.userId, userId));
  }

  async updateLicenseApplicationStatus(practiceNumber: string, status: string, notes?: string): Promise<LicenseApplication | undefined> {
    const [application] = await db
      .update(licenseApplications)
      .set({ 
        status, 
        notes,
        updatedAt: new Date() 
      })
      .where(eq(licenseApplications.practiceNumber, practiceNumber))
      .returning();
    return application || undefined;
  }

  async createLicenseRenewal(insertRenewal: InsertLicenseRenewal): Promise<LicenseRenewal> {
    const practiceNumber = `PR${new Date().getFullYear()}${String(Date.now()).slice(-8)}`;
    const [renewal] = await db
      .insert(licenseRenewals)
      .values({
        ...insertRenewal,
        practiceNumber,
        status: insertRenewal.status || "In Elaborazione",
        documents: insertRenewal.documents || null,
        medicalCertificate: insertRenewal.medicalCertificate || null,
      })
      .returning();
    return renewal;
  }

  async getLicenseRenewal(practiceNumber: string): Promise<LicenseRenewal | undefined> {
    const [renewal] = await db
      .select()
      .from(licenseRenewals)
      .where(eq(licenseRenewals.practiceNumber, practiceNumber));
    return renewal || undefined;
  }

  async getLicenseRenewalsByUserId(userId: number): Promise<LicenseRenewal[]> {
    return await db
      .select()
      .from(licenseRenewals)
      .where(eq(licenseRenewals.userId, userId));
  }

  async updateLicenseRenewalStatus(practiceNumber: string, status: string): Promise<LicenseRenewal | undefined> {
    const [renewal] = await db
      .update(licenseRenewals)
      .set({ 
        status,
        updatedAt: new Date() 
      })
      .where(eq(licenseRenewals.practiceNumber, practiceNumber))
      .returning();
    return renewal || undefined;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values({
        ...insertAppointment,
        status: insertAppointment.status || "Programmato",
      })
      .returning();
    return appointment;
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId));
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async getLicenseStatus(licenseNumber: string): Promise<LicenseStatus | undefined> {
    const [status] = await db
      .select()
      .from(licenseStatus)
      .where(eq(licenseStatus.licenseNumber, licenseNumber));
    return status || undefined;
  }

  async getLicenseStatusByUserId(userId: number): Promise<LicenseStatus | undefined> {
    const [status] = await db
      .select()
      .from(licenseStatus)
      .where(eq(licenseStatus.userId, userId));
    return status || undefined;
  }

  async createLicenseStatus(insertStatus: InsertLicenseStatus): Promise<LicenseStatus> {
    const [status] = await db
      .insert(licenseStatus)
      .values({
        ...insertStatus,
        points: insertStatus.points || 20,
        isValid: insertStatus.isValid !== undefined ? insertStatus.isValid : true,
        violations: insertStatus.violations || null,
      })
      .returning();
    return status;
  }

  async updateLicensePoints(licenseNumber: string, points: number): Promise<LicenseStatus | undefined> {
    const [status] = await db
      .update(licenseStatus)
      .set({ 
        points,
        updatedAt: new Date() 
      })
      .where(eq(licenseStatus.licenseNumber, licenseNumber))
      .returning();
    return status || undefined;
  }
}

export const storage = new DatabaseStorage();
