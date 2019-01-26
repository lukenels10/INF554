import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosAngelesCountyMapComponent } from './los-angeles-county-map.component';

describe('LosAngelesCountyMapComponent', () => {
  let component: LosAngelesCountyMapComponent;
  let fixture: ComponentFixture<LosAngelesCountyMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosAngelesCountyMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosAngelesCountyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
