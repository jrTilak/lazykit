import { useDocumentTitle } from "./useDocumentTitle";

export const InboxTitle = ({ unread }: { unread: number }) => {
  useDocumentTitle(unread === 0 ? "Inbox" : `Inbox (${unread})`);
  return <p>{unread} unread messages</p>;
};
