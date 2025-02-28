import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { UserSessionService } from '../login/user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css'],
})
export class WishListComponent implements OnInit, AfterViewChecked {
  places: any[] = [];
  wishlist: any[] = [];
  userId: string = '';
  selectedPlace: any;
  apiUrl = 'http://localhost:5000/places';
  carouselsInitialized = false;

  constructor(
    private http: HttpClient,
    private userSession: UserSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      const user = this.userSession.getUser();
      if (user && user._id) {
        this.userId = user._id;
        this.fetchWishlist();
      } else {
        console.error('User ID not found in session');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  ngAfterViewChecked(): void {
    if (this.wishlist.length > 0 && !this.carouselsInitialized) {
      this.initializeCarousels();
      this.carouselsInitialized = true;
    }
  }

  fetchPlaceById(placeId: string): void {
    console.log(placeId)
    this.http.get<any>(`http://localhost:5000/places/place/${placeId}`).subscribe(
      (response) => {
        console.log(response)
        this.places.unshift(response)
        console.log('Place details fetched:', this.places);
      },
      (error) => {
        console.error('Error fetching place details:', error);
        alert('Unable to fetch place details. Please try again later.');
      }
    );
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
      const modal = new bootstrap.Modal(
        document.getElementById('placeDetailsModal')!
      );
      modal.show();
    } catch (error) {
      console.error('Error showing place details modal:', error);
    }
  }

  fetchWishlist(): void {
    if (!this.userId) {
      console.error('User ID is not defined');
      return;
    }
    this.places = [];
    this.http
      .get<{ wishList: any[] }>(`http://localhost:5000/user/wishlist/${this.userId}`)
      .subscribe(
        (data) => {
          this.wishlist = data.wishList || [];
          for(let i=0;i<this.wishlist.length;i++){
            this.fetchPlaceById(this.wishlist[i]);
          }
        },
        (error) => {
          console.error('Error fetching wishlist:', error);
          alert('Unable to fetch wishlist. Please try again later.');
        }
      );
  }

  toggleWishlist(place: any): void {
    if (!this.userId) {
      console.error('User not logged in');
      alert('You need to log in to use the wishlist feature.');
      return;
    }

    this.http
      .post('http://localhost:5000/user/wishlist', {
        userId: this.userId,
        placeId: place._id,
      })
      .subscribe(
        (response: any) => {
          if (response.wishList && response.wishList.includes(place._id)) {
            this.wishlist.push(place);
            this.fetchWishlist();
          } else {
            this.wishlist = this.wishlist.filter((p) => p._id !== place._id);
            this.fetchWishlist();
          }
        },
        (error) => {
          console.error('Error updating wishlist:', error);
          alert('Unable to update wishlist. Please try again later.');
        }
      );
  }

  isInWishlist(place: any): boolean {
    return this.wishlist.some((p) => p._id === place._id);
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('placeDetailsModal');
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

  showNearbyHotels(place: string,placeId : any): void {
    // Log the placeId for debugging purposes
    const modalElement = document.getElementById('placeDetailsModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        document.body.classList.remove('modal-open');
      });
    }
    // Navigate to the NearbyHotelsComponent, passing the placeId as a route parameter
    this.router.navigate(['/nearby-hotels', placeId]);
  }

  showNearbyRestaurants(place: string,placeId : any): void {
    // Log the placeId for debugging purposes
    const modalElement = document.getElementById('placeDetailsModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        document.body.classList.remove('modal-open');
      });
    }
    // Navigate to the NearbyHotelsComponent, passing the placeId as a route parameter
    this.router.navigate(['/nearby-restaurants', placeId]);
  }

  navigateToReviewPage(placeId : any ): void {
    const modalElement = document.getElementById('placeDetailsModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        document.body.classList.remove('modal-open');
      });
    }
    // Navigate to the NearbyHotelsComponent, passing the placeId as a route parameter
    this.router.navigate(['/review', placeId]);
  } 
  
}
