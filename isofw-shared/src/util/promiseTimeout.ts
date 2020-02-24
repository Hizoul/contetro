const promiseTimeout = (waitTime: number) => {
  return new Promise((resolve) => {setTimeout(resolve, waitTime)})
}
export default promiseTimeout
