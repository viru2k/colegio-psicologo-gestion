import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupObraSocialEditarComponent } from './popup-obra-social-editar.component';

describe('PopupObraSocialEditarComponent', () => {
  let component: PopupObraSocialEditarComponent;
  let fixture: ComponentFixture<PopupObraSocialEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupObraSocialEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupObraSocialEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
