import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface RouteLink {
  path: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class RouteLinkService {
  public links = new BehaviorSubject([]) as BehaviorSubject<RouteLink[]>;

  constructor() {
  }

  public registerLinks(...links: RouteLink[]) {
    this.links.next(this.links.value.concat(links));
  }
}
