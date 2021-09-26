import Link from 'next/link'
import ThemeSwitch from './themeSwitcher'
import { Layers, Sidebar } from '@geist-ui/react-icons'
import { Wallet } from "./WalletAdapter/Wallet"
import React, { useEffect } from "react"
import { Button, Drawer, Spacer, Page } from "@geist-ui/react"
import LoggedIn from "./LoggedIn"
import KbarButton from "./KBar/button"
import { useRecoilState } from "recoil"
import { mobileNavbarVisiblityState } from "../store/mobileNavbar"

const Header = (): JSX.Element => {
  const [state, setState] = useRecoilState(mobileNavbarVisiblityState);

  const Brand = () => (
    <Page.Header>
      <Link href="/" passHref>
        <div className="flex flex-row items-stretch">
          <div className="pr-4 self-center">
            <Layers />
          </div>
          <div className="pt-3 self-auto">
            <h3 className="hover:underline text">hyperound</h3>
          </div>
        </div>
      </Link>
    </Page.Header>
  );

  return (
    <>
      <Spacer h={2} />
      {/* For Desktops */}
      <div className="hidden sm:flex flex-row justify-between items-center py-2 mt-4 w-full backdrop-blur-3xl">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight">
          <Brand />
        </h2>

        <div className="flex flex-row items-center">
          <div className="pr-8">
            <Wallet />
          </div>
          <div className="pr-6">
            <KbarButton />
          </div>
          <div className="pr-8">
            <ThemeSwitch />
          </div>
          <div>
            <LoggedIn />
          </div>
        </div>
      </div>

      {/* For Mobiles */}
      <div className="sm:hidden">
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
          <Drawer.Title></Drawer.Title>
          <Drawer.Subtitle></Drawer.Subtitle>
          <Drawer.Content>
            <div className="flex flex-col gap-8 justify-around items-center h-full">
              <div> <Wallet /> </div>
              <div> <LoggedIn /> </div >
              <div> <KbarButton /> </div>
              <div> <ThemeSwitch /> </div>
            </div>
          </Drawer.Content>
        </Drawer>
      </div>
    </>
  )
}

export default Header