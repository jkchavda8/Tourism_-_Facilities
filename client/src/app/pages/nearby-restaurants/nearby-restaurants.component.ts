import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '../login/user-session.service';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nearby-restaurants',
  templateUrl: './nearby-restaurants.component.html',
  styleUrl: './nearby-restaurants.component.css'
})
export class NearbyRestaurantsComponent implements OnInit, AfterViewInit {

  placeId: string | null = null;
  nearbyRestaurants: any[] = [];
  errorMessage: string | null = null;
  private apiUrl = 'http://localhost:5000';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private userSessionService: UserSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('placeId');
    console.log('Received placeId:', this.placeId);
    if (this.placeId) {
      this.fetchNearbyRestaurants(this.placeId);
    }
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
  }

  fetchNearbyRestaurants(placeId: string): void {
    const url = `${this.apiUrl}/places/${placeId}/nearByRestaurants`;
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.nearbyRestaurants = response;
        console.log('Nearby restaurants:', this.nearbyRestaurants);
      },
      (error) => {
        console.error('Error fetching nearby restaurants:', error);
        this.errorMessage = 'Could not load nearby restaurants. Please try again later.';
      }
    );
  }

  selectedRestaurant: any;

  viewDetails(restaurant: any) {
    this.selectedRestaurant = restaurant;
    const modal = new bootstrap.Modal(document.getElementById('restaurantDetailsModal')!);
    modal.show();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('restaurantDetailsModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        document.body.classList.remove('modal-open');
      });
    }
  }
}
