import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggInnComponent } from './logg-inn.component';

describe('LoggInnComponent', () => {
  let component: LoggInnComponent;
  let fixture: ComponentFixture<LoggInnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggInnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggInnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
