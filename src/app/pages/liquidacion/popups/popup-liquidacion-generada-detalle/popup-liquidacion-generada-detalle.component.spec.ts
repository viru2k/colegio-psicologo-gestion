import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLiquidacionGeneradaDetalleComponent } from './popup-liquidacion-generada-detalle.component';

describe('PopupLiquidacionGeneradaDetalleComponent', () => {
  let component: PopupLiquidacionGeneradaDetalleComponent;
  let fixture: ComponentFixture<PopupLiquidacionGeneradaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupLiquidacionGeneradaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupLiquidacionGeneradaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
