import { lazyLoad } from './modules/lazy-load'

document.addEventListener('DOMContentLoaded', function() {
  // polyfill supports svg external content (svg sprites) to browsers > IE8
  svg4everybody()

  const greet = () => new Promise((resolve, reject) => {
    setTimeout(() => resolve('promising greeting!'), 1000)
  })

  greet().then(res => console.log(res))
  lazyLoad().then(res => console.log(res))
})
