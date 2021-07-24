import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLiquidacionExpedienteDetalleComponent } from './popup-liquidacion-expediente-detalle.component';

describe('PopupLiquidacionExpedienteDetalleComponent', () => {
  let component: PopupLiquidacionExpedienteDetalleComponent;
  let fixture: ComponentFixture<PopupLiquidacionExpedienteDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupLiquidacionExpedienteDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupLiquidacionExpedienteDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
