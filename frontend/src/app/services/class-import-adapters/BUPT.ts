import {Class, ClassTime, Range, WeekType} from '../types/Class';
import {ClassImportAdapter} from '../class-import.service';
import {JsonHelper} from '../../utils/json-helper';

const LENGTH_TABLE = 18;
export default class BUPTParser implements ClassImportAdapter {
  name = 'BUPT';
  maxDay = 5;
  timeTable = [
    '8:00-8:45',
    '8:50-9:35',
    '9:50-10:35',
    '10:40-11.25',
    '11:30-12:15',
    '13:00-13:45',
    '13:50-14:35',
    '14:45-15:30',
    '15:40-16:25',
    '16:35-17:20',
    '17:25-18:10',
    '18:30-19:05',
    '19:20-20:05',
    '20:10-20:55',
  ];

  parse(dom: HTMLElement): Class[] {
    const tableNodes = dom.getElementsByClassName('displayTag');
    if (!tableNodes.length) {
      throw Error('invalid Node');
    }
    const data = (new XPathEvaluator()).evaluate('tbody/tr', tableNodes.item(tableNodes.length - 1),
      null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    const loc: string[] = [];
    const formatted = [];
    let n: Node;
    while (true) {
      n = data.iterateNext();
      if (n != null) {
        const cs = n.childNodes;
        cs.forEach((t, i) => {
          loc[LENGTH_TABLE - cs.length + i] = t.textContent;
        });
        formatted.push(Array(...loc));
      } else {
        break;
      }
    }

    const map = new Map<string, Class>();
    // 0培养方案	1课程号	2课程名	3课序号	4学分	5课程属性	6考试类型	7教师	8大纲日历	9修读方式	10选课状态	11周次	12星期	13节次	14节数	15校区	16教学楼	17教室
    // 2019级 通信工程（+人工智能，大类招生）	 2122120000	 大学生心理健康	 01	 0.5	 必修	 考查	 杜玉春*	大纲日历	 正常	 置入	  3-7	  1	 1	  2	  沙河校区	  综合办公楼	  办-一层多功能厅
    formatted.forEach((row: string[]) => {
      const c = map[row[2]] || JsonHelper.parseObject(Class, {name: row[2], score: +row[4], teacher: row[7], place: row[17], times: []});
      const regex = /(|.*：)(\d+)-(\d+)/;
      const weekI = row[11].match(regex);
      if (weekI) {
        const time = JsonHelper.parseObject(ClassTime,
          {weeks: {}, weekDay: +row[12], session: {start: +row[13], end: ((+row[13]) + (+row[14]) - 1)}});
        if (c.place !== row[17]) {
          time.place = row[17];
        }
        (time.weeks as Range).start = +weekI[2];
        (time.weeks as Range).end = +weekI[3];
        if (weekI[1].includes('双')) {
          time.type = WeekType.DoubleWeek;
        } else if (weekI[1].includes('单')) {
          time.type = WeekType.SingleWeek;
        }
        c.times.push(time);
      }
      map.set(row[2], c);
    });
    return [...map.values()];
  }
}
