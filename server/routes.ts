import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertLicenseApplicationSchema, insertLicenseRenewalSchema, insertAppointmentSchema } from "@shared/schema";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByFiscalCode(userData.fiscalCode);
      if (existingUser) {
        return res.status(400).json({ error: "User with this fiscal code already exists" });
      }

      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.get("/api/users/fiscal-code/:fiscalCode", async (req, res) => {
    try {
      const user = await storage.getUserByFiscalCode(req.params.fiscalCode);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // License application routes
  app.post("/api/license-applications", upload.array('documents'), async (req, res) => {
    try {
      const applicationData = insertLicenseApplicationSchema.parse(req.body);
      
      // Handle uploaded files
      const documents = req.files ? (req.files as Express.Multer.File[]).map(file => file.originalname) : [];
      
      const application = await storage.createLicenseApplication({
        ...applicationData,
        documents,
      });
      
      res.json(application);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid application data" });
    }
  });

  app.get("/api/license-applications/:practiceNumber", async (req, res) => {
    try {
      const application = await storage.getLicenseApplication(req.params.practiceNumber);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/license-applications/user/:userId", async (req, res) => {
    try {
      const applications = await storage.getLicenseApplicationsByUserId(parseInt(req.params.userId));
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/license-applications/:practiceNumber/status", async (req, res) => {
    try {
      const { status, notes } = req.body;
      const application = await storage.updateLicenseApplicationStatus(req.params.practiceNumber, status, notes);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // License renewal routes
  app.post("/api/license-renewals", upload.array('documents'), async (req, res) => {
    try {
      const renewalData = insertLicenseRenewalSchema.parse(req.body);
      
      // Handle uploaded files
      const documents = req.files ? (req.files as Express.Multer.File[]).map(file => file.originalname) : [];
      
      const renewal = await storage.createLicenseRenewal({
        ...renewalData,
        documents,
      });
      
      res.json(renewal);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid renewal data" });
    }
  });

  app.get("/api/license-renewals/:practiceNumber", async (req, res) => {
    try {
      const renewal = await storage.getLicenseRenewal(req.params.practiceNumber);
      if (!renewal) {
        return res.status(404).json({ error: "Renewal not found" });
      }
      res.json(renewal);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Appointment routes
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid appointment data" });
    }
  });

  app.get("/api/appointments/user/:userId", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByUserId(parseInt(req.params.userId));
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // License status routes
  app.get("/api/license-status/:licenseNumber", async (req, res) => {
    try {
      const status = await storage.getLicenseStatus(req.params.licenseNumber);
      if (!status) {
        return res.status(404).json({ error: "License not found" });
      }
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/license-status/check", async (req, res) => {
    try {
      const { licenseNumber, fiscalCode } = req.body;
      
      if (!licenseNumber || !fiscalCode) {
        return res.status(400).json({ error: "License number and fiscal code are required" });
      }

      const user = await storage.getUserByFiscalCode(fiscalCode);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const status = await storage.getLicenseStatus(licenseNumber);
      if (!status || status.userId !== user.id) {
        return res.status(404).json({ error: "License not found or doesn't belong to this user" });
      }

      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Practice status check
  app.post("/api/practice-status/check", async (req, res) => {
    try {
      const { practiceNumber, fiscalCode } = req.body;
      
      if (!practiceNumber || !fiscalCode) {
        return res.status(400).json({ error: "Practice number and fiscal code are required" });
      }

      const user = await storage.getUserByFiscalCode(fiscalCode);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check license applications
      const application = await storage.getLicenseApplication(practiceNumber);
      if (application && application.userId === user.id) {
        return res.json({
          type: 'application',
          data: application
        });
      }

      // Check license renewals
      const renewal = await storage.getLicenseRenewal(practiceNumber);
      if (renewal && renewal.userId === user.id) {
        return res.json({
          type: 'renewal',
          data: renewal
        });
      }

      res.status(404).json({ error: "Practice not found" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
