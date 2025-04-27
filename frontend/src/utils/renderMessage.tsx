export default function renderMessage(text: string, isMe: boolean) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline break-all font-name underline-offset-3 ${isMe ? 'text-blue-900' : 'text-blue-400'}`}
        >
          {part}
        </a>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });
}
