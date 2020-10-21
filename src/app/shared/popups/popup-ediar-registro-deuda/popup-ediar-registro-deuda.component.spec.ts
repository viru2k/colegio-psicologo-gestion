import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEdiarRegistroDeudaComponent } from './popup-ediar-registro-deuda.component';

describe('PopupEdiarRegistroDeudaComponent', () => {
  let component: PopupEdiarRegistroDeudaComponent;
  let fixture: ComponentFixture<PopupEdiarRegistroDeudaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupEdiarRegistroDeudaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupEdiarRegistroDeudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
