import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { markAttendance, getMyAttendance } from "../controllers/attendence.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API za prisustvo studenata
 */

/**
 * @swagger
 * api/attendance/{termId}:
 *   patch:
 *     summary: Obeležavanje prisustva studenta
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: termId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID termina na kojem se obeležava prisustvo
 *     responses:
 *       200:
 *         description: Prisustvo uspešno obeleženo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Attendance marked successfully"
 *       401:
 *         description: Korisnik nije autentifikovan
 *       404:
 *         description: Termin nije pronađen
 */
router.patch("/:termId", authenticate, markAttendance);

/**
 * @swagger
 * api/attendance/me:
 *   get:
 *     summary: Dohvatanje svih prisustava prijavljenog studenta
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista prisustava studenta
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   termId:
 *                     type: string
 *                     example: "1234567890"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2026-02-24"
 *                   present:
 *                     type: boolean
 *                     example: true
 *       401:
 *         description: Korisnik nije autentifikovan
 */
router.get("/me", authenticate, getMyAttendance);

export default router;