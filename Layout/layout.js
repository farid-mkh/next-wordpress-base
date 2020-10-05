import Alert from '../components/tools/alert'
import Footer from '../components/common/footer'
import Meta from '../components/common/meta'

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
