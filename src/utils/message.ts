import { defineExtensionMessaging } from '@webext-core/messaging';
import {cre} from '@/utils/logger';

interface ProtocolMap {
  getStringLength(data: string): number;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>({
  logger: log,
});
