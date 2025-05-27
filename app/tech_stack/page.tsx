export default function TechStack() {
  return (
    <div className="text-lg">
      <h1 className="font-bold">
        My Tech Stack
      </h1>
      <p className="pt-4">
        {`After over a decade with Linux, I've settled into a setup that just works. I've tried various distributions over the years, mostly Debian-based, but Pop!_OS has become my daily driver - it strikes the perfect balance between stability and staying out of my way.`}
      </p>
      <h1 className="pt-4 font-bold">
        Hardware Setup
      </h1>
      <p className=" pt-4">
        {`My personal machine is a Slimbook Titan laptop that handles everything I throw at it:`}
      </p>
      <p className=" pt-4">
        {`CPU: AMD Ryzen 9 5900HX`}
      </p>
      <p>
        {`Display: 15.6″ QHD IPS at 165Hz`}
      </p>
      <p>
        {`Memory: 64GB DDR4`}
      </p>
      <p>
        {`Storage: Dual 1TB M.2 SSDs (one for Windows when needed, one for Pop!_OS)`}
      </p>
      <p>
        {`Graphics: NVIDIA RTX 3070Ti`}
      </p>
      <p>
        {`Keyboard: Opto-mechanical with RGB keys`}
      </p>
      <p className=" pt-4">
        {`I run a tri-monitor setup because screen real estate matters. The laptop screen handles browsing and music, the main monitor is for coding, and the third keeps an eye on servers and logs. For ergonomics, I use an Ergodox EZ with Cherry MX switches and an ergonomic mouse - after years of coding, your wrists will thank you.`}
      </p>
      <h1 className="font-bold pt-4">
        Software
      </h1>

      <p className=" pt-4">
        {`For development, I live in neovim and kitty terminal. Neovim gives me the speed and customization I need, while kitty's GPU acceleration keeps everything smooth. The combination lets me stay in the flow without the interface getting in the way.`}
      </p>

      <h1 className="font-bold pt-4">
        Why This Setup Works
      </h1>

      <p className=" pt-4">
        {`This isn't just about having powerful hardware - it's about creating an environment where I can focus on solving problems instead of fighting with tools. Every choice, from the Linux distro to the keyboard layout, is optimized for long coding sessions and the kind of deep work that actually moves projects forward.`}

      </p>
    </div>
  )
}
