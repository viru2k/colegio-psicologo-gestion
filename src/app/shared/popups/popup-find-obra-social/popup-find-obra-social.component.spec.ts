import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFindObraSocialComponent } from './popup-find-obra-social.component';

describe('PopupFindObraSocialComponent', () => {
  let component: PopupFindObraSocialComponent;
  let fixture: ComponentFixture<PopupFindObraSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFindObraSocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupFindObraSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
