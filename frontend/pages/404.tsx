import Header from '../components/Header';
import Footer from "../components/Footer";

export default function Home(): JSX.Element {
  return (
    <div className="page">
      <Header />
      <div>
        <div className="container p-4">
          <h1 className="m-5 text-9xl font-extrabold"> कहाँ  ? </h1>
        </div>
      </div>
      <Footer />
    </div>
  )
}