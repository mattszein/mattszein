import DateTime from "@/app/ui/os/DateTime"
import Volume from "@/app/ui/icons/os/Volume"
import Battery from "@/app/ui/icons/os/Battery"
import Wifi from "@/app/ui/icons/os/Wifi"
import Bluetooth from "@/app/ui/icons/os/Bluetooth"
import Temperature from "@/app/ui/icons/os/Temperature"
import Cpu from "@/app/ui/icons/os/Cpu"
import Memory from "@/app/ui/icons/os/Memory"
import Lock from "@/app/ui/icons/os/Lock"

const BarOS = () => {
  const workspaces = [1, 2, 3, 4]
  const activeWorkspace = 1

  return (
    <div className="flex items-center justify-between bg-black font-mono text-md text-[#c6d0f5]">
      {/* Workspaces */}
      <div className="flex basis-1/3 bg-black">
        {workspaces.map((ws, i) => {
          const num = i + 1
          const isActive = num === activeWorkspace
          return (
            <span
              key={ws}
              className={`min-w-[1.25rem] cursor-default px-1.5 py-0.5 text-center ${isActive ? "text-[#85c1dc] opacity-100" : "opacity-50"
                }`}
            >
              {isActive ? "●" : ws}
            </span>
          )
        })}
      </div>

      {/* Clock */}
      <DateTime />

      {/* System modules */}
      <div className="flex basis-1/3 items-center justify-end">
        <span className="ml-4 flex cursor-default items-center gap-1 rounded-l-[5px] bg-black px-2 py-0.5 text-[#babbf1]">
          <Volume /> 45%
        </span>
        <span className="flex cursor-default items-center bg-black px-2 py-0.5">
          <Battery />
        </span>
        <span className="flex cursor-default items-center bg-black px-2 py-0.5">
          <Wifi />
        </span>
        <span className="mr-5 flex cursor-default items-center bg-black px-2 py-0.5">
          <Bluetooth />
        </span>
        <span className="flex cursor-default items-center gap-1 bg-black px-2 py-0.5">
          42° <Temperature />|
        </span>
        <span className="flex cursor-default items-center gap-1 bg-black px-2 py-0.5">
          2% <Cpu />|
        </span>
        <span className="mr-4 flex cursor-default items-center gap-1 rounded-r-[5px] bg-black px-2 py-0.5">
          4.2G <Memory />
        </span>
        <span className="flex cursor-default items-center rounded-[5px] bg-black px-2 py-0.5 text-[#babbf1]">
          <Lock />
        </span>
      </div>
    </div>
  )
}

export default BarOS
