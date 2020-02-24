import * as http from "http"

const emptyPort: () => Promise<number> = () => {
  return new Promise((resolve, reject) => {
    const server: any = http.createServer()
      .listen(0, () => {
        const port = server.address().port
        server.close(() => {
          resolve(port)
        })
      })
      .on(`error`, reject)
  })
}

export default emptyPort
