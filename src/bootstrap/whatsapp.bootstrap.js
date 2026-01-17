import qrcodePkg from "qrcode-terminal";
import { createWhatsappClient } from "../clients/whatsapp.client.js";
import { WHATSAPP_EVENTS } from "../constants/events.js";
import { validateMessage } from "../validators/message.schema.js";
import { handleCommand } from "../handlers/index.js";
import { isCommand } from "../middlewares/command.middleware.js";
import { isNewMessage } from "../middlewares/message.middleware.js";

export function initWhatsapp(whatsappConfig) {
  const client = createWhatsappClient(whatsappConfig);

  client.on(WHATSAPP_EVENTS.QR, (qr) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`;
    console.log("🔗 Scan QR via browser:");
    console.log(qrUrl);
  });

  client.once(WHATSAPP_EVENTS.AUTH_FAILURE, (message) => {
    console.error("❌ Auth failure:", message);
    console.error("Please re-scan QR code");
  });

  client.once(WHATSAPP_EVENTS.READY, () => {
    console.log("✅ client is ready");
  });

  client.on(WHATSAPP_EVENTS.DISCONNECTED, () => {
    console.warn("⚠️ Client is disconnected");
  });

  client.on(WHATSAPP_EVENTS.MESSAGE, async (message) => {
    if (!isNewMessage(message)) return;
    if (!validateMessage(message)) return;
    if (!isCommand(message)) return;

    await handleCommand(message, client);
  });

  return client.initialize();
}
