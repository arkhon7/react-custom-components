import { useState } from 'react'
import { Slider, Slide } from './transform-scroller'
import styles from "./transform-scroller/main.module.css"

function App() {
  const [count, setCount] = useState(0)

  return (
   <Slider
   className={styles.slider}
   interval={1000}
   direction="y"
   sliderStyle={{
     transition: "all",
     transitionDuration: "1s",
     transitionTimingFunction: "ease-in-out",
   }}>
    <Slide offset={0} className={styles.slide}>
      <div>SLIDE 1</div>
    </Slide>
    <Slide offset={-100} className={styles.slide}>
    <div>SLIDE 2</div>
    </Slide >
    <Slide offset={-200} className={styles.slide}>
    <div>SLIDE 3</div>
    </Slide>
    <Slide offset={-300} className={styles.slide}>
    <div>SLIDE 4</div>
    </Slide>
   </Slider>
  )
}

export default App
