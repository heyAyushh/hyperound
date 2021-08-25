import Link from 'next/link'
import ThemeSwitch from './themeSwitcher'
import { Layers } from '@geist-ui/react-icons'
import { Wallet } from "./WalletAdapter/Wallet"

const Header = (): JSX.Element => {
  return (
    <div className="flex flex-row justify-between items-center py-2 mt-4 mb-10 w-full backdrop-blur-3xl">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight">
        <Link href="/" passHref>
          <div className="flex flex-row items-baseline">
            <div className="pr-4">
              <Layers />
            </div>
            <div>
              <h3 className="hover:underline text">hyperound</h3>
            </div>
          </div>
        </Link>
      </h2>

      <div className="flex flex-row ">
        <div className="pr-8 ">
          <Wallet />
        </div>
        <div className=" ">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  )
}

export default Header