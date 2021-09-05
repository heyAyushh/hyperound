import Link from 'next/link'
import ThemeSwitch from './themeSwitcher'
import { Layers } from '@geist-ui/react-icons'
import { Wallet } from "./WalletAdapter/Wallet"
import React from "react"
import { Button, Drawer } from "@geist-ui/react"

const Header = (): JSX.Element => {
  const [state, setState] = React.useState(false)

  return (
    <>
      {/* For Desktops
      <div className="flex flex-row justify-between items-center py-2 mt-4 mb-10 w-full backdrop-blur-3xl md:block">
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
      </div> */}

      {/* For Mobiles */}
      <div>
        <Button auto onClick={() => setState(true)} scale={1 / 2}>Show Drawer</Button>
        <Drawer visible={state} onClose={() => setState(false)} placement="right">
          <Drawer.Title>Drawer</Drawer.Title>
          <Drawer.Subtitle>This is a drawer</Drawer.Subtitle>
          <Drawer.Content>
            <p>Some content contained within the drawer.</p>
          </Drawer.Content>
        </Drawer>
      </div>
    </>
  )
}

export default Header