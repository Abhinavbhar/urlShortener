export const metadata = {
  title: 'Home - Simple',
  description: 'Page description',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
import Testimonials from '@/components/testimonials'
import Newsletter from '@/components/newsletter'
import Footer from '@/components/ui/footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials/>
      <Newsletter />
      <Footer></Footer>
    </>
  )
}
