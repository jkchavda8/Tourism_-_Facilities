import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSessionService } from '../login/user-session.service';

@Component({
  selector: 'app-update-restaurant',
  templateUrl: './update-restaurant.component.html',
  styleUrl: './update-restaurant.component.css'
})
export class UpdateRestaurantComponent implements OnInit{
  restaurantToUpdate: any;
  selectedPhotos: File[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userSessionService: UserSessionService
  ) {}

  ngOnInit(): void {
    const restaurantId = this.activatedRoute.snapshot.paramMap.get('id');
    if (restaurantId) {
      this.getRestaurantDetails(restaurantId);
    }
  }

  getRestaurantDetails(restaurantId: string): void {
    this.http.get(`http://localhost:5000/restaurant/restaurants/${restaurantId}`).subscribe(
      (response: any) => {
        this.restaurantToUpdate = response;
        console.log('restaurant data for update:', this.restaurantToUpdate);
      },
      (error) => {
        console.error('Error fetching restaurant details:', error);
      }
    );
  }

  updateRestaurant(): void {
    if (
      !this.restaurantToUpdate.title ||
      !this.restaurantToUpdate.description ||
      !this.restaurantToUpdate.address.streetAddress ||
      !this.restaurantToUpdate.address.city ||
      !this.restaurantToUpdate.address.state ||
      !this.restaurantToUpdate.address.country ||
      !this.restaurantToUpdate.address.pincode ||
      isNaN(this.restaurantToUpdate.address.pincode) ||
      !this.restaurantToUpdate.address.latitude ||
      isNaN(this.restaurantToUpdate.address.latitude) ||
      !this.restaurantToUpdate.address.longitude ||
      isNaN(this.restaurantToUpdate.address.longitude)
    ) {
      alert('All fields are required and numeric fields must be valid.');
      return;
    }

    const formData = new FormData();
    
    formData.append('title', this.restaurantToUpdate.title);
    formData.append('description', this.restaurantToUpdate.description);
    formData.append('price', this.restaurantToUpdate.price.toString());
    formData.append('address', JSON.stringify(this.restaurantToUpdate.address)); // Address as JSON string

    for (let i = 0; i < this.selectedPhotos.length; i++) {
      formData.append('listingPhotoPaths', this.selectedPhotos[i]);
    }

    formData.append('owner', JSON.stringify(this.userSessionService.getUser()));
    console.log(this.restaurantToUpdate._id);
    this.http.put(`http://localhost:5000/restaurant/update/${this.restaurantToUpdate._id}`, formData).subscribe(
      (response) => {
        alert('Restaurant updated successfully');
        this.router.navigate(['/restaurants']);
      },
      (error) => {
        console.error('Error updating restaurant:', error);
        alert('Error updating restaurant');
      }
    );
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.restaurantToUpdate.address.latitude = position.coords.latitude;
          this.restaurantToUpdate.address.longitude = position.coords.longitude;
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  onFileChange(event: any): void {
    if (event.target.files) {
      this.selectedPhotos = Array.from(event.target.files);
    }
  }

  navigateToRestaurant(): void {
    this.router.navigate(['/restaurants']);
  }
}
