const WindowOS = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="w-full h-screen flex flex-col max-h-screen overflow-hidden">{children}</div>
}

export default WindowOS;

