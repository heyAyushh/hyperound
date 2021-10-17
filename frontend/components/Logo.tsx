import { useTheme } from "next-themes";
import { motion } from "framer-motion";
{/* <link rel="apple-touch-icon" href="/custom_icon.png"/> */ }

export default function LogoComponent(): JSX.Element {

  const { theme } = useTheme();

  const isLight = theme === 'light';

  return (
    <div className="ml-0 sm:ml-2">
      <svg fill="none" className="w-10 sm:w-12 h-10 sm:h-12 transition duration-200 ease-in-out hover:ease-in transform" viewBox="0 0 1024 1024">
        <g clipPath="url(#a)">
          <path fill="#000" d="M0 0h1024v1024H0z" />
          <path fill="#F9FB00" d="M128 0h128v1024H128z" />
          <path fill="#02FEFF" d="M256 0h128v1024H256z" />
          <path fill="#01FF00" d="M384 0h128v1024H384z" />
          <path fill="#FD00FB" d="M512 0h128v1024H512z" />
          <path fill="#FB0102" d="M640 0h128v1024H640z" />
          <path fill="#0301FC" d="M768 0h128v1024H768z" />
          <motion.g
            animate={{ rotate: [0, 90, 180, 270, 360], opacity: [0.5, 1, 0.5] }}
            transition={{
              type: 'just',
              repeat: Infinity,
            }}
          // oon
          >
            <path fill="#02FEFF" d="M576 637V381h64v256z" />
            <path fill="#01FF00" d="M512 637V381h64v256z" />
            <path fill="#FD00FB" d="M448.127 636.706v-256h64v256z" />
            <path fill="#FB0102" d="M384 636.705v-256h64v256z" />
          </motion.g>
          <path fill="#000" d="M2.04 128 0 0h1024v128H2.04ZM0 1024V896h1024v128H0Z" />
          <path fill="#000" d="M896 0h128v1024H895L896 0ZM0 0h130.04l-2.044 1024H0V0Z" />

        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h1024v1024H0z" />
          </clipPath>
        </defs>
      </svg>

    </div >
  );
}