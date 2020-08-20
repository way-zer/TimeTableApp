import {Class, ClassTime, Range, WeekType} from '../types/Class';
import {ClassImportAdapter} from '../class-import.service';
import {JsonHelper} from '../../../utils/json-helper';

const LENGTH_TABLE = 18;

export class BUPTNewParser implements ClassImportAdapter {
  uniqueName = 'BUPT2';
  name = 'BUPT新教务系统';
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
    const tableNodes = dom.getElementsByTagName('table');
    if (!tableNodes.length) {
      throw Error('invalid Node');
    }
    const datas = tableNodes[0].getElementsByClassName('kbcontent');
    const formatted = [];
    for (let i = 0; i < datas.length; i++) {
      const data = datas.item(i);
      const nodes = data.childNodes; // 0:课程名(可能占2位) 2:br 3:教师 4:br 5:周次与节次 6:br 7:地点 8:br
      var d = {} as any
      nodes.forEach(n => {
        if (!d.name) d = {
          name: "", teacher: "",
          time: "",
          place: "",
          weekday: +data.id.split('-')[1], // Like "A73306CD9B4B438F8F8666870F41A417-1-2",Get 1
        }
        switch (true) {
          case (n.nodeType == Node.TEXT_NODE && !n.textContent.startsWith("--")):
            d.name = n.textContent;
            return;
          case (n.nodeType == Node.TEXT_NODE)://多个课程分隔符 -------
            formatted.push(d)
            d = {}
            return;
          case ((n as Element).tagName == "BR"):
            return;
          case ((n as HTMLFontElement).title == "老师"):
            d.teacher = n.textContent;
            return;
          case ((n as HTMLFontElement).title == "周次(节次)"):
            d.time = n.textContent;
            return;
          case ((n as HTMLFontElement).title == "教室"):
            d.place = n.textContent;
            return;
        }
      })
      if (d.name) formatted.push(d)
    }

    const map = new Map<string, Class>();
    formatted.forEach((value) => {
      const c = map.get(value.name) || JsonHelper.parseObject(Class,
        {name: value.name, score: 0, teacher: value.teacher, place: value.place, times: []});
      const regex = /([-0-9,]+)\(周\)\[([-0-p]+)节\]/;
      const weekI = value.time.match(regex);
      if (weekI) {
        const regexRange = /(\d+)-(\d+)/;
        let weeks;
        let weekType: WeekType;
        if (weekI[1].match(regexRange)) {
          const rangeMatch = weekI[1].match(regexRange);
          weeks = new Range();
          weeks.start = +rangeMatch[1];
          weeks.end = +rangeMatch[2];
          weekType = WeekType.Range;
        } else {
          weeks = weekI[1].split(',').map(value1 => +value1);
          weekType = WeekType.Weeks;
        }
        const session = new Range();
        const l = weekI[2].split('-');
        session.start = +l[0];
        session.end = +l.reverse()[0];
        const time = JsonHelper.parseObject(ClassTime, {weeks, weekDay: value.weekday, session, type: weekType});
        if (!c.times.find(value1 => JSON.stringify(value1) === JSON.stringify(time))) {
          c.times.push(time);
        }
      }
      map.set(c.name, c);
    });
    return [...map.values()];
  }
}
