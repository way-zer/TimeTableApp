export class Todo {
  title: string
  color: string
  process = 0
  startTime: number
  realTime = 0
  likelyTime: number
  finishTime = 0

  static afterParse() {
  }
}
