export default function LogoWordmark(props: { className?: string }) {
  return (
    <div className={props.className}>
      <div className="h-10 w-10 rounded-lg bg-brand-500 grid place-content-center">
        <span className="text-white font-black">S</span>
      </div>
    </div>
  )
}



