import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCreate } from './tour-create';

describe('TourCreate', () => {
  let component: TourCreate;
  let fixture: ComponentFixture<TourCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(TourCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
