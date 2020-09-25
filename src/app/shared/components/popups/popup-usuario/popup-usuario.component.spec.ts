import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUsuarioComponent } from './popup-usuario.component';

describe('PopupUsuarioComponent', () => {
  let component: PopupUsuarioComponent;
  let fixture: ComponentFixture<PopupUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
