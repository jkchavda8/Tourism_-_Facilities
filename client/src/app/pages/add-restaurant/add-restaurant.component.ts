import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '../login/user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.css'
})
export class AddRestaurantComponent {
  newRestaurant: any = {
    title: '',
    description: '',
    price: 0,
    address: {
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      pincode: 0,
      latitude: 0,
      longitude: 0,
    },
    listingPhotoPaths: []  // To hold selected files
  };

  constructor(private http: HttpClient, private userSessionService: UserSessionService, private router:Router) {}

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Update latitude and longitude fields with the retrieved location
          this.newRestaurant.address.latitude = position.coords.latitude;
          this.newRestaurant.address.longitude = position.coords.longitude;
          console.log('Latitude:', this.newRestaurant.address.latitude, 'Longitude:', this.newRestaurant.address.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve location. Please allow location access in your browser.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  // Handle file input change
  onFileChange(event: any) {
    if (event.target.files) {
      this.newRestaurant.listingPhotoPaths = event.target.files;
    }
  }

  addHotel() {
    // Validate fields
    if (
      !this.newRestaurant.title ||
      !this.newRestaurant.description ||
      !this.newRestaurant.address.streetAddress ||
      !this.newRestaurant.address.city ||
      !this.newRestaurant.address.state ||
      !this.newRestaurant.address.country ||
      !this.newRestaurant.address.pincode ||
      isNaN(this.newRestaurant.address.pincode) ||
      !this.newRestaurant.address.latitude ||
      isNaN(this.newRestaurant.address.latitude) ||
      !this.newRestaurant.address.longitude ||
      isNaN(this.newRestaurant.address.longitude) ||
      this.newRestaurant.listingPhotoPaths.length === 0 // Ensure photos are selected
    ) {
      console.error('All fields are required and numeric fields must be valid.');
      return;
    }
    let obj: { [key: string]: any } = {}; 
    
    // console.log(obj);
    const formData = new FormData();
    
    // Append the fields to the form data
    formData.append('title', this.newRestaurant.title);
    formData.append('description', this.newRestaurant.description);
    formData.append('price', this.newRestaurant.price.toString());

    // Address
    formData.append('address', JSON.stringify(this.newRestaurant.address));

    // Attach photos to form data
    for (let i = 0; i < this.newRestaurant.listingPhotoPaths.length; i++) {
      formData.append('listingPhotoPaths', this.newRestaurant.listingPhotoPaths[i]);
    }

    // Attach owner
    console.log(this.userSessionService.getUser())
    formData.append('owner', JSON.stringify(this.userSessionService.getUser()));

    // Make the HTTP POST request
    this.http.post('http://localhost:5000/restaurant/create', formData).subscribe(
      (response) => {
        console.log('Restaurant added successfully:', response);
        this.resetForm();
        this.navigateToRestaurant();
      },
      (error) => {
        console.error('Error adding Restaurant:', error);
      }
    );
  }

  resetForm() {
    this.newRestaurant = {
      title: '',
      description: '',
      price: 0,
      address: {
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        pincode: 0,
        latitude: 0,
        longitude: 0,
      },
      listingPhotoPaths: [], // Reset photos
    };
  }

  navigateToRestaurant(): void {
    this.router.navigate(['/restaurants']);
  }
}
