import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupProveedorFindComponent } from './popup-proveedor-find.component';

describe('PopupProveedorFindComponent', () => {
  let component: PopupProveedorFindComponent;
  let fixture: ComponentFixture<PopupProveedorFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupProveedorFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupProveedorFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
