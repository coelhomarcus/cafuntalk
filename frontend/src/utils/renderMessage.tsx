export default function renderMessage(text: string) {
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
          className={`text-white underline break-all`}
        >
          {part}
        </a>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });
}
