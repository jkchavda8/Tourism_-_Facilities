import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { UserSessionService } from '../login/user-session.service';
import { Router } from '@angular/router';

declare const window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewChecked, AfterViewInit {
  places: any[] = [];
  apiUrl = 'http://localhost:5000/places/search';
  carouselsInitialized = false;
  wishlist: string[] = [];
  userId: string = '';
  selectedPlace: any;
  userQuery: string = '';
  botResponse: string = '';
  loading:boolean = false;
  error:boolean = false;
  formattedBotResponse:string = '';
  categories: string[] = [
    'Historical Site',
    'Museum',
    'National Park',
    'Beach',
    'Mountain',
    'Waterfall',
    'Lake',
    'Cultural Landmark',
    'Wildlife Sanctuary',
    'Adventure Park',
  ];
  selectedCategory: string = '';
  searchQuery: string = '';
  profileImagePath: string = '';

  constructor(
    private http: HttpClient,
    private userSession: UserSessionService,
    private router: Router
  ) {}

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }  

  openChatBot() {
    var modal = new bootstrap.Modal(document.getElementById('chatBotModal')!);
    modal.show();
  }
  
  sendMessage() {
    if (!this.userQuery.trim()) return;
  
    this.loading = true;  // Show loader
    this.error = false;   // Reset error flag
  
    this.http.post<any>('http://localhost:5002/chat', { message: this.userQuery })
      .subscribe(response => {
        this.botResponse = response.response;
        this.formattedBotResponse = this.formatResponse(this.botResponse);
        this.loading = false;
      }, error => {
        this.botResponse = "Error connecting to chatbot. Please try again!";
        this.formattedBotResponse = this.botResponse;
        this.error = true;
        this.loading = false;
      });
  }
  
  formatResponse(response: string): string {
    if (!response) return ''; // Prevent errors on empty responses

    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **Bold**
      .replace(/\* (.*?)\n/g, '<li>$1</li>') // Convert bullet points
      .replace(/\n/g, '<br>'); // Convert new lines to <br>
  }

  ngOnInit(): void {
    try {
      this.fetchAllPlaces();
      const user = this.userSession.getUser();
      if (user && user._id) {
        this.userId = user._id;
        this.profileImagePath = user.profileImagePath;
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
    if (this.places.length > 0 && !this.carouselsInitialized) {
      this.initializeCarousels();
      this.carouselsInitialized = true;
    }
  }

  onCategoryChange(): void{
    this.fetchAllPlaces();
  }

  getStarArray(rating: number): number[] {
    const normalizedRating = Math.min(rating, 5); // Ensure max rating is 5
    const fullStars = Math.floor(normalizedRating);
    const decimalPart = normalizedRating - fullStars;
    const halfStar = decimalPart >= 0.25 && decimalPart <= 0.75 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
  
    return [...Array(fullStars).fill(1), ...Array(halfStar).fill(0.5), ...Array(emptyStars).fill(0)];
  }
  

  fetchAllPlaces(): void {
    const params: any = this.searchQuery ? { query: this.searchQuery } : {};
    // if(this.selectedCategory) console.log('here')
    if (this.selectedCategory) params.categories = this.selectedCategory;
    this.http.get<{ success: boolean; data: any[] }>(this.apiUrl,{params}).subscribe(
      (response) => {
        // console.log(response.data);
        this.places = response.data.map((place: any, index: number) => ({
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

  onSearchChange(): void {
    this.fetchAllPlaces();
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

  ngAfterViewInit(): void {
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
  }

  logout(): void {
    try {
      this.userSession.clearSession();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Unable to logout. Please try again.');
    }
  }

  toggleWishlist(place: any): void {
    if (!this.userId) {
      console.error('User not logged in');
      alert('You need to log in to use the wishlist feature.');
      return;
    }

    this.http.post('http://localhost:5000/user/wishlist', {
      userId: this.userId,
      placeId: place._id,
    }).subscribe(
      (response: any) => {
        console.log('Backend response:', response); // Debugging response
      console.log('Place ID:', place._id); 
        if (response.wishList && response.wishList.includes(place._id)) {
          this.wishlist.push(place._id);// Add to wishlist
        } else {
          this.wishlist = this.wishlist.filter((id) => id !== place._id);// Remove from wishlist
        }
      },
      (error) => {
        console.error('Error updating wishlist:', error);
        alert('Unable to update wishlist. Please try again later.');
      }
    );
  }

  isInWishlist(place: any): boolean {
    return this.wishlist.includes(place._id);
  }

  fetchWishlist(): void {
    if (!this.userId) {
      console.error('User ID is not defined');
      return;
    }

    this.http.get<{ wishList: string[] }>(`http://localhost:5000/user/wishlist/${this.userId}`).subscribe(
      (data) => {
        this.wishlist = data.wishList || [];
        console.log(this.wishlist);
      },
      (error) => {
        console.error('Error fetching wishlist:', error);
        alert('Unable to fetch wishlist. Please try again later.');
      }
    );
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
