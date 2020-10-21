import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarClienteFacturaComponent } from './buscar-cliente-factura.component';

describe('BuscarClienteFacturaComponent', () => {
  let component: BuscarClienteFacturaComponent;
  let fixture: ComponentFixture<BuscarClienteFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarClienteFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarClienteFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
