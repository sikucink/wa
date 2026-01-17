import wwebjsPkg from "whatsapp-web.js";

const { Client, LocalAuth } = wwebjsPkg;

export function createWhatsappClient(whatsappConfig) {
  return new Client({
    authStrategy: new LocalAuth({
      dataPath: whatsappConfig.auth.sessionPath,
    }),
    deviceName: whatsappConfig.deviceName,
    puppeteer: {
      executablePath: process.env.CHROME_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    },
    // temp
    webVersionCache: {
      type: "remote",
      remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/refs/heads/main/html/2.3000.1031490220-alpha.html`,
    },
  });
}
