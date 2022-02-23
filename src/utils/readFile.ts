import fs from 'fs'
import { parse } from 'csv-parse'

export default {
  readFile<T>(path: string, delimiter: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      let data = []
      const parser = parse({
        delimiter
      })
      const readStream = fs.createReadStream(path)
      readStream.pipe(parser)
      parser.on("data", (line: string[]) => {
        const [value0, value1] = line
        data.push({
          value0,
          value1
        })
        parser.on("end", async () => {
          resolve(data)
        })
          .on("error", (error) => {
            reject(error)
          })
      })
    })

  }
}