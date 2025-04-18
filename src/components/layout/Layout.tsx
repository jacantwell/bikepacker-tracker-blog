import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import { ThemeSwitcher } from './ThemeSwitcher'

const Layout = () => {
  return (
    <div className="min-h-screen">
      <ThemeSwitcher />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout