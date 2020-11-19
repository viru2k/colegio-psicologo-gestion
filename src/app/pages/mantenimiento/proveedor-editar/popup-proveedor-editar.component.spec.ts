import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupProveedorEditarComponent } from './popup-proveedor-editar.component';

describe('PopupProveedorEditarComponent', () => {
  let component: PopupProveedorEditarComponent;
  let fixture: ComponentFixture<PopupProveedorEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupProveedorEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupProveedorEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
