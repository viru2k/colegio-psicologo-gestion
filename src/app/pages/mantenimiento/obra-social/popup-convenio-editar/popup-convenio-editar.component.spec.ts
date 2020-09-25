import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupConvenioEditarComponent } from './popup-convenio-editar.component';

describe('PopupConvenioEditarComponent', () => {
  let component: PopupConvenioEditarComponent;
  let fixture: ComponentFixture<PopupConvenioEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupConvenioEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupConvenioEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
