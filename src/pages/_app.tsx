import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }: AppProps) {
  const onKeyUp = (event) => {
    if (event.key === 'Escape') {
      document.getElementById('searchInput').blur()
    }
  }

  useEffect(() => {
    console.log('Loaded')
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Subcheck</title>
      </Head>
      <div>
        <Header />
        <div className='relative'>
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default MyApp
