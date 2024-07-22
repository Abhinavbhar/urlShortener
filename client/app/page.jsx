export const metadata = {
  title: 'Home - Simple',
  description: 'Page description',
}

import Features from '@/components/features'
import Newsletter from '@/components/newsletter'
import Footer from '@/components/ui/footer'

export default function Home() {
  return (
    <>
    
      <Features />
      <Footer></Footer>
    </>
  )
}
