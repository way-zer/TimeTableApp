import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GymTryComponent} from './gym-try.component';

describe('GymTryComponent', () => {
  let component: GymTryComponent;
  let fixture: ComponentFixture<GymTryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GymTryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GymTryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
