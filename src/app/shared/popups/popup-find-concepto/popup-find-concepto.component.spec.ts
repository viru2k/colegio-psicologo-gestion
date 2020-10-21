import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFindConceptoComponent } from './popup-find-concepto.component';

describe('PopupFindConceptoComponent', () => {
  let component: PopupFindConceptoComponent;
  let fixture: ComponentFixture<PopupFindConceptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFindConceptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupFindConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
