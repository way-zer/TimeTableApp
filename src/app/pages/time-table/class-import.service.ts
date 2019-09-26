import {Injectable} from '@angular/core';
import {Class, WeekType} from './time-table.service';

export interface ClassImportAdapter {
  maxDay: number;
  timeTable: string[];

  // Can throw Error
  parse(dom: Node): Class[];
}

const LENGTH_TABLE = 18;

class BUPTParser implements ClassImportAdapter {
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

  parse(dom: Node): Class[] {
    const data = (new XPathEvaluator()).evaluate('//table/tbody/tr', dom);
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
    // 0培养方案	1课程号	2课程名	3课序号	4学分	5课程属性	6考试类型	7教师	8大纲日历	9修读方式	10选课状态	11周次	12星期	13节次	14节数	15校区	16教学楼	17教室
    // 2019级 通信工程（+人工智能，大类招生）	 2122120000	 大学生心理健康	 01	 0.5	 必修	 考查	 杜玉春*	大纲日历	 正常	 置入	  3-7	  1	 1	  2	  沙河校区	  综合办公楼	  办-一层多功能厅
    return formatted.map((row: string[]) => {
      const c = new Class(row[2], +row[4], row[7], row[17], 0, 0, +row[12], +row[13], +row[14]);
      const regex = /(|.*：)(\d+)-(\d+)/;
      const weekI = row[11].match(regex);
      if (weekI) {
        if (weekI[1].includes('双')) {
          c.weekOther = WeekType.Double;
        } else if (weekI[1].includes('单')) {
          c.weekOther = WeekType.Single;
        }
        c.weeksS = +weekI[2];
        c.weeksE = +weekI[3];
      }
      return c;
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClassImportService {

  constructor() {
  }

  public getAdopter(name: string): ClassImportAdapter {
    // noinspection JSRedundantSwitchStatement
    switch (name) {
      case 'BUPT':
        return new BUPTParser();
      default:
        throw Error('NO SUCH ADAPTER');
    }
  }
}
