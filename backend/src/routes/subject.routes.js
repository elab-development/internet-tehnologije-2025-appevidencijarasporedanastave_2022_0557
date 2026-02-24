import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";
import { getAllSubjects } from "../controllers/subject.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: API za upravljanje predmetima
 */

/**
 * @swagger
 * api/subjects:
 *   get:
 *     summary: Dohvatanje svih predmeta (samo admin)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista svih predmeta
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60a7c5d3f1e7b80017f0c123"
 *                   name:
 *                     type: string
 *                     example: "Matematika 1"
 *                   code:
 *                     type: string
 *                     example: "MAT101"
 *       401:
 *         description: Korisnik nije autentifikovan
 *       403:
 *         description: Korisnik nema administratorska prava
 */
router.get("/", authenticate, authorizeAdmin, getAllSubjects);

export default router;