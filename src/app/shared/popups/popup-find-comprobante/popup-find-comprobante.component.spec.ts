import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFindComprobanteComponent } from './popup-find-comprobante.component';

describe('PopupFindComprobanteComponent', () => {
  let component: PopupFindComprobanteComponent;
  let fixture: ComponentFixture<PopupFindComprobanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFindComprobanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupFindComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
