import { MessageNotification } from "../models/notifications/message-notification";

export function createMessageNotification(content: string, dateTime: Date) {
  return new MessageNotification({ id: MessageNotification.currentId++, title: "Message notification", description: content, dateTime })
}

export function createErrorNotification(title: string, body: string) {
  return new MessageNotification({ id: MessageNotification.currentId++, title, description: body, dateTime: new Date(), isError: true })
}