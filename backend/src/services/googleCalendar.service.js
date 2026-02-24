import { google } from "googleapis";

export const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

export const generateAuthUrl = (userId) => {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    prompt: "consent", // Važno: primorava Google da pošalje refresh_token
    state: userId.toString(),
  });
};

export const getGoogleTokens = async (code) => {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const createGoogleEvent = async (user, termData) => {
  const oauth2Client = createOAuth2Client();
  
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = {
    summary: termData.subjectName,
    description: `Predavanje iz predmeta ${termData.subjectName} sinhronizovano iz aplikacije.`,
    start: { 
      dateTime: termData.startTime, 
      timeZone: "Europe/Belgrade" 
    },
    end: { 
      dateTime: termData.endTime, 
      timeZone: "Europe/Belgrade" 
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  return response.data;
};