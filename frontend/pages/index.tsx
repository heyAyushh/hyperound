import { Wallet } from "../components/WalletAdapter/Wallet";
import { Button } from "@geist-ui/react";
import Header from '../components/header';

export default function Home() {
  return (
    <div>
      <Header />
      <h1 className="font-extrabold text-9xl m-5"> Namaste 🙏</h1>
      <Wallet />
    </div>
  )
}
