import Battery from "@/app/ui/icons/OS/Battery"
import DateTime from "@/app/ui/OS/DateTime"

const BarOS = () => {
  return <div className="flex bg-zinc-900 font-bold text-sm sm:text-md">
    <div className="basis-1/3">
      <ul className="flex gap-1">
        <li className="hover:bg-zinc-700 hover:rounded-2xl py-1 px-2 m-1 cursor-default sm:block hidden">Workspaces</li>
        <li className="hover:bg-zinc-700 hover:rounded-2xl py-1 px-2 m-1 cursor-default">Applications</li>
      </ul>
    </div>
    <div className="flex basis-1/3 justify-center">
      <DateTime />
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
