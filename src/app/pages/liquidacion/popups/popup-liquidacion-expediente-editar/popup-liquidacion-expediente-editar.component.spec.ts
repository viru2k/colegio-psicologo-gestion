import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLiquidacionExpedienteEditarComponent } from './popup-liquidacion-expediente-editar.component';

describe('PopupLiquidacionExpedienteEditarComponent', () => {
  let component: PopupLiquidacionExpedienteEditarComponent;
  let fixture: ComponentFixture<PopupLiquidacionExpedienteEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupLiquidacionExpedienteEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupLiquidacionExpedienteEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
