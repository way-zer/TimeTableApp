import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

const KEY = 'privateLinks';

export interface Link {
  href: string;
  title: string;
  private: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsefulLinksService {
  private pLinks: Link[] = JSON.parse(localStorage.getItem(KEY)) || [];
  private subject = new BehaviorSubject(this.pLinks);

  constructor(private http: HttpClient) {
    this.subject.subscribe(data => {
      localStorage.setItem(KEY, JSON.stringify(data));
    });
  }

  public getUsefulLinks(): Observable<Link[]> {
    return this.http.get('/assets/usefulLinks.json').pipe(
      concatMap((val: Link[]) =>
        this.subject.pipe(map(data => (val || []).concat(data)))
      )
    );
  }

  public addPrivateLink(link: Link) {
    link.private = true;
    this.pLinks = this.pLinks.concat(link);
    this.subject.next(this.pLinks);
  }

  public removeLink(link: Link) {
    const index = this.pLinks.indexOf(link);
    if (index > -1) {
      this.pLinks.splice(index, 1);
      this.subject.next(this.pLinks);
    }
  }
}
