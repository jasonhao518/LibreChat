import { useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { ContentTypes } from 'librechat-data-provider';
import type { TMessage } from 'librechat-data-provider';

export default function useCopyToClipboard({
  text,
  messageId,
  content,
}: Partial<Pick<TMessage, 'text' | 'content' | 'messageId'>>) {
  const copyToClipboard = useCallback(
    (setIsCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
      setIsCopied(true);
      let messageText = text ?? '';
      if (content) {
        messageText = content.reduce((acc, curr, i) => {
          if (curr.type === ContentTypes.TEXT) {
            return acc + curr.text.value + (i === content.length - 1 ? '' : '\n');
          }
          return acc;
        }, '');
      }
      copy(messageText ?? '', { format: 'text/plain' });

      if (messageId) {
        const element = document.getElementById(messageId);
        if (window.Asc && window.Asc.plugin) {
          window.Asc.plugin.executeMethod('PasteHtml', [element?.innerHTML]);
        }
      }

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    },
    [text, content],
  );

  return copyToClipboard;
}
