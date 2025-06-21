import Image from "next/image"
import Link from "next/link"

function Header() {
  return (
    <header>
        <Link href="/"></Link>
        <Image src="/tool.png" height={60} width={60} alt="logo" className="rounded" priority></Image>
    </header>
  )
}

export default Header
