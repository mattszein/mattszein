import Battery from "@/app/ui/icons/OS/Battery"
const BarOS = () => {
  const time = new Date();
  return <div className="flex bg-zinc-900 text-sm font-bold">
    <div className="basis-1/3">
      <ul className="flex gap-1">
        <li className="hover:bg-zinc-700 hover:rounded-2xl py-1 px-2 m-1 cursor-default">Workspaces</li>
        <li className="hover:bg-zinc-700 hover:rounded-2xl py-1 px-2 m-1 cursor-default">Applications</li>
      </ul>
    </div>
    <div className="flex basis-1/3 justify-center">
      <p className="flex gap-2 hover:bg-zinc-700 hover:rounded-2xl py-1 px-3 m-1 cursor-default">
        <span>{new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
        }).format(time)}
        </span>
        <span>{new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric"
        }).format(time)}
        </span>
      </p>
    </div>
    <div className="flex basis-1/3 justify-end">
      <ul className="flex gap-2 hover:bg-zinc-700 hover:rounded-2xl py-1 px-3 m-1 cursor-default">
        <li className="flex gap-1.5"><div className="flex items-center"><Battery /></div><div>
          100 % </div></li>
      </ul>
    </div>

  </div>
}

export default BarOS;

