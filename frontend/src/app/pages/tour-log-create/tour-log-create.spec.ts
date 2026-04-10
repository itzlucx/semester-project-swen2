import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourLogCreate } from './tour-log-create';

describe('TourLogCreate', () => {
  let component: TourLogCreate;
  let fixture: ComponentFixture<TourLogCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourLogCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(TourLogCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
