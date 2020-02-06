export const lazyLoad = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve('promising lazy loading!'), 2000)
})
