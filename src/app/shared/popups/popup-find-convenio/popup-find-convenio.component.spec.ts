import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFindConvenioComponent } from './popup-find-convenio.component';

describe('PopupFindConvenioComponent', () => {
  let component: PopupFindConvenioComponent;
  let fixture: ComponentFixture<PopupFindConvenioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFindConvenioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupFindConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
