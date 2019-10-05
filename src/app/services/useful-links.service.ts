import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

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
  private readonly priLinks = new BehaviorSubject(JSON.parse(localStorage.getItem(KEY)) || []);
  private readonly pubLinks = this.http.get('/assets/usefulLinks.json').pipe(distinctUntilChanged()) as Observable<Link[]>;
  public readonly usefulLinks = combineLatest(this.pubLinks, this.priLinks).pipe(
    map(([pub, pri]) => pub.concat(pri))
  );

  constructor(private http: HttpClient) {
    this.priLinks.subscribe(data => {
      localStorage.setItem(KEY, JSON.stringify(data));
    });
  }

  public addPrivateLink(link: Link) {
    link.private = true;
    // this.pLinks = this.pLinks.concat(link);
    this.priLinks.next(this.priLinks.value.concat(link));
  }

  public removeLink(link: Link) {
    const index = this.priLinks.value.indexOf(link);
    if (index > -1) {
      this.priLinks.value.splice(index, 1);
      this.priLinks.next(this.priLinks.value);
    }
  }
}
