import { useEffect } from 'react'
import AOS, { AosOptions } from 'aos'
import 'aos/dist/aos.css'

const initAOS = (opts?: AosOptions) => {
  useEffect(() => {
    AOS.init(opts)
  }, [])
}

export default initAOS
