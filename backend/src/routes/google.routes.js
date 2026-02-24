import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  googleCallback,
  getAuthUrl,
  syncAllTerms
} from "../controllers/googleCalendar.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Google Calendar
 *   description: API za integraciju sa Google Calendar
 */

/**
 * @swagger
 * api/google/auth:
 *   get:
 *     summary: Dobavljanje URL-a za Google autorizaciju
 *     tags: [Google Calendar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: URL za autorizaciju
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://accounts.google.com/o/oauth2/auth?..."
 *       401:
 *         description: Korisnik nije autentifikovan
 */
router.get("/auth", authenticate, getAuthUrl);

/**
 * @swagger
 * api/google/callback:
 *   get:
 *     summary: Callback ruta nakon Google autorizacije
 *     tags: [Google Calendar]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code koji šalje Google
 *     responses:
 *       200:
 *         description: Google nalog uspešno autorizovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google account connected successfully"
 *       400:
 *         description: Nije prosleđen code ili greška pri autorizaciji
 */
router.get("/callback", googleCallback);

/**
 * @swagger
 * api/google/sync-all:
 *   post:
 *     summary: Sinhronizacija svih termina sa Google Calendar
 *     tags: [Google Calendar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Svi termini uspešno sinhronizovani
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 syncedCount:
 *                   type: integer
 *                   example: 15
 *                 message:
 *                   type: string
 *                   example: "All terms synced to Google Calendar successfully"
 *       401:
 *         description: Korisnik nije autentifikovan
 */
router.post("/sync-all", authenticate, syncAllTerms);

export default router;