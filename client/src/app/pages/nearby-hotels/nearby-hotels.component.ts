import { Component, OnInit,AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '../login/user-session.service';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nearby-hotels',
  templateUrl: './nearby-hotels.component.html',
  styleUrl: './nearby-hotels.component.css'
})
export class NearbyHotelsComponent implements OnInit, AfterViewInit{

  placeId: string | null = null;
  nearbyHotels: any[] = [];
  errorMessage: string | null = null;
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient,private route: ActivatedRoute,private userSessionService: UserSessionService, private router: Router) {}

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('placeId');
    console.log('Received placeId:', this.placeId);
    if (this.placeId) {
      // console.log('here')
      this.fetchNearbyHotels(this.placeId);
    }
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
    
  }

  fetchNearbyHotels(placeId: string): void {
    const url = `${this.apiUrl}/places/${placeId}/nearByHotels`;
    
    console.log('here')
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.nearbyHotels = response;
        console.log('Nearby hotels:', this.nearbyHotels);
      },
      (error) => {
        console.error('Error fetching nearby hotels:', error);
        this.errorMessage = 'Could not load nearby hotels. Please try again later.';
      }
    );
  }

  selectedHotel: any;
    
    viewDetails(hotel: any) {
        this.selectedHotel = hotel;
        const modal = new bootstrap.Modal(document.getElementById('hotelDetailsLabel')!);
        modal.show();
      }
  
      ngAfterViewInit() {
        const modalElement = document.getElementById('hotelDetailsModal');
        if (modalElement) {
          modalElement.addEventListener('hidden.bs.modal', () => {
            // Ensure backdrop is removed
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
      
            // Remove 'modal-open' class from body if it persists
            document.body.classList.remove('modal-open');
          });
        }
      }
}
