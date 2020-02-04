const greet = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve('promising greeting!'), 1000)
})

greet().then(res => console.log(res))
