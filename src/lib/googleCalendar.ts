import { google } from "googleapis";

export interface CalendarEventResult {
  eventId: string | null;
  meetLink: string | null;
  htmlLink: string | null;
}

function getOAuth2Client() {
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "http://localhost");
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

export async function createCalendarEvent({
  summary,
  description,
  date,
  time,
  attendeeEmail,
  attendeeName,
}: {
  summary: string;
  description: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:MM"
  attendeeEmail: string;
  attendeeName: string;
}): Promise<CalendarEventResult> {
  const auth = getOAuth2Client();
  if (!auth) return { eventId: null, meetLink: null, htmlLink: null };

  try {
    const calendar   = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

    const [hh, mm] = time.split(":").map(Number);
    const totalEnd  = hh * 60 + mm + 45;
    const endTime   = `${String(Math.floor(totalEnd / 60)).padStart(2, "0")}:${String(totalEnd % 60).padStart(2, "0")}`;

    const event = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary,
        description,
        start: { dateTime: `${date}T${time}:00`, timeZone: "America/Costa_Rica" },
        end:   { dateTime: `${date}T${endTime}:00`, timeZone: "America/Costa_Rica" },
        attendees: [{ email: attendeeEmail, displayName: attendeeName }],
        conferenceData: {
          createRequest: {
            requestId: `syb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 30 },
          ],
        },
      },
    });

    const meetLink =
      event.data.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri ?? null;

    return {
      eventId: event.data.id ?? null,
      meetLink,
      htmlLink: event.data.htmlLink ?? null,
    };
  } catch (err) {
    console.error("Google Calendar error:", err);
    return { eventId: null, meetLink: null, htmlLink: null };
  }
}

export async function cancelCalendarEvent(eventId: string): Promise<boolean> {
  const auth = getOAuth2Client();
  if (!auth) return false;
  try {
    const calendar   = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    await calendar.events.delete({ calendarId, eventId, sendUpdates: "all" });
    return true;
  } catch (err) {
    console.error("Google Calendar cancel error:", err);
    return false;
  }
}
