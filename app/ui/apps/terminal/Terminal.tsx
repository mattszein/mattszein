const Terminal = () => {
  const src = process.env.NODE_ENV === "production" ? "https://terminal-ai-chat.matinger.workers.dev/embed" : "http://localhost:4321/embed";
  return (
    <iframe
      src={src}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin"
      title="matt terminal"
      loading="lazy"
    />
  );
}

export default Terminal;
