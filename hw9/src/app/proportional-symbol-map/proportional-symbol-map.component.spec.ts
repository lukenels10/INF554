import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProportionalSymbolMapComponent } from './proportional-symbol-map.component';

describe('ProportionalSymbolMapComponent', () => {
  let component: ProportionalSymbolMapComponent;
  let fixture: ComponentFixture<ProportionalSymbolMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProportionalSymbolMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProportionalSymbolMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
