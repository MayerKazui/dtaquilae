import { labels } from "./labels.js";
import { messages } from "./messages.js";

export function getLabels(labelKey) {
  const keys = labelKey.split(".");
  let result = labels;

  for (const key of keys) {
    if (result.hasOwnProperty(key)) {
      result = result[key];
    } else {
      return labelKey + ' non défini';
    }
  }

  return result;
}

export function getMessages(messageKey) {
  const keys = messageKey.split(".");
  let result = messages;

  for (const key of keys) {
    if (result.hasOwnProperty(key)) {
      result = result[key];
    } else {
      return messageKey + ' non défini';
    }
  }

  return result;
}
