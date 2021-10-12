import ThemeSwitch from './themeSwitcher'
import { Layers, Sidebar } from '@geist-ui/react-icons'
import { Wallet } from "./WalletAdapter/Wallet"
import React, { useEffect } from "react"
import { Button, Drawer, Spacer, Page } from "@geist-ui/react"
import Link from "next/link";
import LoggedIn from "./LoggedIn"
import KbarButton from "./KBar/button"
import { useRecoilState } from "recoil"
import { mobileNavbarVisiblityState } from "../store/mobileNavbar"
import DynamicMenu, { MenuItem } from 'react-animated-menu'
import LogoComponent from "./Logo"

const Header = (): JSX.Element => {
  const [state, setState] = useRecoilState(mobileNavbarVisiblityState);

  const Brand = () => (
    <Link href="/" passHref>
      <div className="flex flex-row items-stretch">
        <div className="self-center pt-2">
          <LogoComponent />
        </div>
        {/* <div className="self-auto pt-3">
          <h3 className="font-bold hover:underline">hyperound</h3>
        </div> */}
      </div>
    </Link >
  );

  const settingPaths = [{
    route: "/settings/profile",
    label: "Settings",
  }];

  const dashboardPaths = [{
    route: "/settings/profile",
    label: "Profile",
  }];

  return (
    <Page.Header>
      {/* For Desktops */}
      <div className="hidden sm:flex sm:flex-row justify-between items-center w-full backdrop-blur-3xl">
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
        <div className="flex flex-row justify-around items-baseline w-full">
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

            <aside>
              {/* Wrap the menu in a Higher Ordered Component */}
              <DynamicMenu
                initialOpenIndex={0}
                easeDuration={150}
                numberOfMenusThatCanBeOpenedAtOnce={1}
              >

                {/* Each menu toggler and the menu list content must be wrapped by a MenuItem
            render prop - and spreading the prop getters to their respective sections. */}
                <MenuItem>
                  {({ isOpen, getToggleProps, getMenuProps, getLinkProps }) => (
                    <>
                      <button {...getToggleProps()} isOpen={isOpen}>
                        Dashboard
                      </button>
                      <ul {...getMenuProps()}>
                        {dashboardPaths.map(p => (
                          // <li key={p.route}>
                          //   <Link to={`/${p.route}/`} {...getLinkProps()}>
                          p.label
                          //   </Link>
                          // </li>
                        ))}
                      </ul>
                    </>
                  )}
                </MenuItem>

                {/* Same as above MenuItem! */}
                <MenuItem>
                  {({ isOpen, getToggleProps, getMenuProps, getLinkProps }) => (
                    <>
                      <button {...getToggleProps()} isOpen={isOpen}>
                        Settings
                      </button>
                      <ul {...getMenuProps()}>
                        {settingPaths.map(p => (
                          <li key={p.route}>
                            {/* <Link to={`${p.route}/`} {...getLinkProps()}>
                              {p.label}
                            </Link> */}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </MenuItem>
              </DynamicMenu>
            </aside>


            <div className="flex flex-col gap-8 justify-around items-center h-full">
              <div> <Wallet /> </div>
              <div> <LoggedIn /> </div >
              <div> <KbarButton /> </div>
              <div> <ThemeSwitch /> </div>
            </div>
          </Drawer.Content>
        </Drawer>
      </div>

    </Page.Header>
  )
}

export default Header