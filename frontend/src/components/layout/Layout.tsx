import { Outlet } from 'react-router'
import Footer from './Footer'
import { ThemeSwitcher } from './ThemeSwitcher'

const Layout = () => {
  return (
    <div className="min-h-screen">
      <ThemeSwitcher />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout