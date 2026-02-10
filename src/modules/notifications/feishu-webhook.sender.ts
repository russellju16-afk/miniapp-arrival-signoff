import axios from "axios";

import { env } from "../../config/env";
import { logger } from "../../config/logger";

const feishuLogger = logger.child({ scope: "feishu-webhook" });

export interface FeishuTextMessage {
  title?: string;
  lines: string[];
}

export async function sendFeishuTextWebhook(
  webhookUrl: string,
  message: FeishuTextMessage
): Promise<{ ok: boolean; reason?: string }> {
  const url = webhookUrl.trim();
  if (!url) {
    return {
      ok: false,
      reason: "webhook url empty"
    };
  }

  const contentLines = [] as string[];
  if (message.title?.trim()) {
    contentLines.push(`【${message.title.trim()}】`);
  }
  for (const line of message.lines) {
    const text = line.trim();
    if (text) {
      contentLines.push(text);
    }
  }

  const payload = {
    msg_type: "text",
    content: {
      text: contentLines.join("\n")
    }
  };

  try {
    const response = await axios.post(url, payload, {
      timeout: env.FEISHU_WEBHOOK_TIMEOUT_MS,
      validateStatus: () => true
    });

    if (response.status < 200 || response.status >= 300) {
      feishuLogger.warn(
        {
          status: response.status,
          body: response.data
        },
        "Feishu webhook returned non-2xx"
      );
      return {
        ok: false,
        reason: `http ${response.status}`
      };
    }

    return {
      ok: true
    };
  } catch (error) {
    feishuLogger.warn({ err: error }, "Feishu webhook request failed");
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "unknown error"
    };
  }
}
