import Link from 'next/link'
import ThemeSwitch from './themeSwitcher'
import { Layers } from '@geist-ui/react-icons'
import { Wallet } from "./WalletAdapter/Wallet"
import React, { useEffect } from "react"
import { Button, Drawer, Spacer } from "@geist-ui/react"
import { Sidebar } from '@geist-ui/react-icons'
import LoggedIn from "./LoggedIn"

const Header = (): JSX.Element => {
  const [state, setState] = React.useState(false);

  const Brand = () => (
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
  );

  return (
    <>
      {/* For Desktops */}
      <div className="hidden sm:flex flex-row justify-between items-center py-2 mt-4 mb-10 w-full backdrop-blur-3xl">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight">
          <Brand />
        </h2>

        <div className="flex flex-row ">
          <div className="pr-8 ">
            <Wallet />
          </div>
          <div className="pr-8 ">
            <ThemeSwitch />
          </div>
          <div>
            <LoggedIn />
          </div>
        </div>
      </div>

      {/* For Mobiles */}
      <div className="sm:hidden ">
        <div className="flex flex-row w-full justify-around items-baseline">
          <div>
            <Brand />
          </div>
          <div>
            <Spacer w={5} />
          </div>
          <Button iconRight={<Sidebar />} auto scale={1} px={0.6} onClick={() => setState(true)} />
        </div>
        <Drawer visible={state} onClose={() => setState(false)} placement="right">
          <Drawer.Title>Hyperound.</Drawer.Title>
          <Drawer.Subtitle></Drawer.Subtitle>
          <Drawer.Content>
            <div className="flex flex-col justify-items-center">
              <Spacer h={5} />
              <div> <Wallet /> </div>
              <Spacer h={5} />
              <div> <ThemeSwitch /> </div>
              <Spacer h={5} />
            </div>
          </Drawer.Content>
        </Drawer>
      </div>
    </>
  )
}

export default Header