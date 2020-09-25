import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupPmoEditarComponent } from './popup-pmo-editar.component';

describe('PopupPmoEditarComponent', () => {
  let component: PopupPmoEditarComponent;
  let fixture: ComponentFixture<PopupPmoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupPmoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupPmoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
