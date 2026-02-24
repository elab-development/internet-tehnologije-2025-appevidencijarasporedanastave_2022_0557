import * as googleCalendarService from "../services/googleCalendar.service.js";
import { success, error } from "../utils/response.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1️⃣ Generiše URL za login
export const getAuthUrl = async (req, res) => {
  try {
    const url = googleCalendarService.generateAuthUrl(req.user.id);
    return success(res, { url }, "Google auth URL generated successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

// 2️⃣ Callback iz Google-a (obrada nakon logovanja)
export const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing code");

    const tokens = await googleCalendarService.getGoogleTokens(code);

    const userId = parseInt(state);
    if (!userId) return res.status(401).send("Invalid state/user");

    const updateData = {
      googleAccessToken: tokens.access_token,
      googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    };

    if (tokens.refresh_token) {
      updateData.googleRefreshToken = tokens.refresh_token;
    }

    // Ažuriranje korisnika u Postgres bazi
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.send(`
      <script>
        window.opener.postMessage("google-auth-success", "*");
        window.close();
      </script>
    `);
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).send("Greška pri autentifikaciji");
  }
};

// 4️⃣ Automatska sinhronizacija SVIH termina
export const syncAllTerms = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Povuci korisnika i njegove termine
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        attendances: {
          include: {
            term: {
              include: { subject: true }
            }
          }
        }
      }
    });

    if (!user || !user.googleAccessToken) {
      return error(res, "Google nalog nije povezan", 401);
    }

    const results = [];
    
    // 2. Prođi kroz sve termine korisnika (preko attendance tabele)
    for (const attendance of user.attendances) {
      const term = attendance.term;
      
      const termData = {
        subjectName: term.subject.name,
        startTime: term.startTime.toISOString(),
        endTime: term.endTime.toISOString(),
      };

      try {
        const googleEvent = await googleCalendarService.createGoogleEvent(user, termData);
        results.push(googleEvent);
      } catch (e) {
        console.error(`Greška pri sync-u termina ${term.id}:`, e.message);
        // Nastavljamo dalje i ako jedan pukne
      }
    }

    return success(res, { count: results.length }, "Svi termini su sinhronizovani");
  } catch (err) {
    console.error("Sync all error:", err);
    return error(res, err.message);
  }
};