import { lazyLoad } from './modules/lazy-load'

document.addEventListener('DOMContentLoaded', function() {
  // supports svg external content (svg sprites) to all browsers > IE8
  svg4everybody()

  const greet = () => new Promise((resolve, reject) => {
    setTimeout(() => resolve('promising greeting!'), 1000)
  })

  greet().then(res => console.log(res))
  lazyLoad().then(res => console.log(res))
})
