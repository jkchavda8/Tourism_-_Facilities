import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyRestaurantsComponent } from './nearby-restaurants.component';

describe('NearbyRestaurantsComponent', () => {
  let component: NearbyRestaurantsComponent;
  let fixture: ComponentFixture<NearbyRestaurantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NearbyRestaurantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NearbyRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
