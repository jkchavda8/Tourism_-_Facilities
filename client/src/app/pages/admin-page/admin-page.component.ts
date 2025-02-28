import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { UserSessionService } from '../login/user-session.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit, AfterViewChecked, AfterViewInit  {
  places: any[] = [];
  apiUrl = 'http://localhost:5000/places/admin';
  carouselsInitialized = false;
  userId: string = '';
  selectedPlace: any;
  contributions: any[] = [];
  contributions2: any[] = [];
  searchQuery: string = '';
  selectedStatus:string = 'Pending';
  
  constructor(
    private http: HttpClient,
    private userSession: UserSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      this.fetchAllPlaces();
      this.fetchAllHotels();
      this.fetchAllRestaurant();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  onStatusChange() {
    // console.log("Selected Status:", this.selectedStatus);
    this.fetchAllPlaces();
    this.fetchAllHotels();
    this.fetchAllRestaurant();
  }

  ngAfterViewChecked(): void {
    if (this.places.length > 0 && !this.carouselsInitialized) {
      this.initializeCarousels();
      this.carouselsInitialized = true;
    }
  }

  fetchAllHotels(): void {
    const params: any = this.searchQuery ? { query: this.searchQuery } : {};
    if (this.selectedStatus) params.status = this.selectedStatus;
    this.http.get<any[]>('http://localhost:5000/hotel',{params}).subscribe(
      (data) => {
        this.contributions = data;
      },
      (error) => {
        console.error('Error fetching hotels:', error);
        alert('Unable to fetch hotels. Please try again later.');
      }
    );
  }  

  fetchAllRestaurant(): void {
    const params: any = this.searchQuery ? { query: this.searchQuery } : {};
    if (this.selectedStatus) params.status = this.selectedStatus;
    this.http.get<any[]>('http://localhost:5000/restaurant',{params}).subscribe(
      (data) => {
        // console.log(data)
        this.contributions2 = data;
      },
      (error) => {
        console.error('Error fetching restaurants:', error);
        alert('Unable to fetch restaurants. Please try again later.');
      }
    );
  }

  onSearchChange(): void {
    this.fetchAllPlaces();
    this.fetchAllHotels();
    this.fetchAllRestaurant();
  }

  fetchAllPlaces(): void {
    const params: any = this.searchQuery ? { query: this.searchQuery } : {};
    if (this.selectedStatus) params.status = this.selectedStatus;
    this.http.get<any[]>(this.apiUrl,{params}).subscribe(
      (data) => {
        this.places = data.map((place, index) => ({
          ...place,
          carouselId: `carousel-${index}`,
        }));
      },
      (error) => {
        console.error('Error fetching places:', error);
        alert('Unable to fetch places. Please try again later.');
      }
    );
  }

  selectedHotel: any;
  selectedRestaurant : any;

  viewHotelsDetails(hotel: any) {
        this.selectedHotel = hotel;
        const modal = new bootstrap.Modal(document.getElementById('hotelDetailsLabel')!);
        modal.show();
  }

  initializeCarousels(): void {
      try {
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach((carousel) => {
          new window.bootstrap.Carousel(carousel, {
            interval: 3000,
            ride: 'carousel',
          });
        });
      } catch (error) {
        console.error('Error initializing carousels:', error);
      }
    }

    viewDetails(place: any): void {
        try {
          this.selectedPlace = place;
          const modal = new bootstrap.Modal(document.getElementById('placeDetailsModal')!);
          modal.show();
        } catch (error) {
          console.error('Error showing place details modal:', error);
        }
      }
    viewRestaurantDetails(restaurant: any): void {
        try {
          this.selectedRestaurant = restaurant;
          const modal = new bootstrap.Modal(document.getElementById('restaurantDetailsModal')!);
          modal.show();
        } catch (error) {
          console.error('Error showing Restaurant details modal:', error);
        }
      }

      ngAfterViewInit(): void {
        const modalElement = document.getElementById('placeDetailsModal');
        const modalElement2 = document.getElementById('hotelDetailsModal');
        const modalElement3 = document.getElementById('restaurantDetailsModal');
        if (modalElement) {
          modalElement.addEventListener('hidden.bs.modal', () => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            document.body.classList.remove('modal-open');
          });
        }
        if (modalElement2) {
          modalElement2.addEventListener('hidden.bs.modal', () => {
            // Ensure backdrop is removed
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
      
            // Remove 'modal-open' class from body if it persists
            document.body.classList.remove('modal-open');
          });
        }
        if (modalElement3) {
          modalElement3.addEventListener('hidden.bs.modal', () => {
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

      logout(): void {
        try {
          this.router.navigate(['/login']);
        } catch (error) {
          console.error('Error during logout:', error);
          alert('Unable to logout. Please try again.');
        }
      }

      toggleStatus(placeId: string, currentStatus: string): void {
        const newStatus = currentStatus === 'pending' ? 'approved' : currentStatus === 'approved' ? 'blocked' : 'approved';
        
        this.http.put(`http://localhost:5000/places/toggle-status/${placeId}`, {})
          .subscribe(
            (updatedPlace) => {
              this.fetchAllPlaces(); // Refresh places list after update
            },
            (error) => {
              console.error('Error updating status:', error);
              alert('Unable to update status. Please try again.');
            }
          );
      }

      toggleStatusHotel(hotelId: string, currentStatus: string): void {
        const newStatus = currentStatus === 'pending' ? 'approved' : currentStatus === 'approved' ? 'blocked' : 'approved';
        
        this.http.put(`http://localhost:5000/hotel/toggle-status/${hotelId}`, {})
          .subscribe(
            (updatedhotel) => {
              this.fetchAllHotels(); 
            },
            (error) => {
              console.error('Error updating status:', error);
              alert('Unable to update status. Please try again.');
            }
          );
      }

      toggleStatusRestaurant(restaurantId: string, currentStatus: string): void {
        const newStatus = currentStatus === 'pending' ? 'approved' : currentStatus === 'approved' ? 'blocked' : 'approved';
        
        this.http.put(`http://localhost:5000/restaurant/toggle-status/${restaurantId}`, {})
          .subscribe(
            (updatedRestaurant) => {
              this.fetchAllRestaurant(); 
            },
            (error) => {
              console.error('Error updating status:', error);
              alert('Unable to update status. Please try again.');
            }
          );
      }
}
