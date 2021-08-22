import Link from 'next/link'
import ThemeSwitch from './themeSwitcher'

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center py-2 w-100 mt-8 mb-10">
      <div >
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight">
          <Link href="/" >
            <a className="hover:underline text">Prsnt 🍿</a>
          </Link>
          .
        </h2>
      </div>

      <div className="justify-end right-0">
        <ThemeSwitch />
      </div>
    </div>
  )
}

export default Header