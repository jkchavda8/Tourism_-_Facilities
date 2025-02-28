import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyHotelsComponent } from './nearby-hotels.component';

describe('NearbyHotelsComponent', () => {
  let component: NearbyHotelsComponent;
  let fixture: ComponentFixture<NearbyHotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NearbyHotelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NearbyHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
