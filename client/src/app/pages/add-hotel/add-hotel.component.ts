import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '../login/user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrl: './add-hotel.component.css'
})
export class AddHotelComponent {
  newHotel: any = {
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
          this.newHotel.address.latitude = position.coords.latitude;
          this.newHotel.address.longitude = position.coords.longitude;
          console.log('Latitude:', this.newHotel.address.latitude, 'Longitude:', this.newHotel.address.longitude);
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
      this.newHotel.listingPhotoPaths = event.target.files;
    }
  }

  addHotel() {
    // Validate fields
    if (
      !this.newHotel.title ||
      !this.newHotel.description ||
      !this.newHotel.address.streetAddress ||
      !this.newHotel.address.city ||
      !this.newHotel.address.state ||
      !this.newHotel.address.country ||
      !this.newHotel.address.pincode ||
      isNaN(this.newHotel.address.pincode) ||
      !this.newHotel.address.latitude ||
      isNaN(this.newHotel.address.latitude) ||
      !this.newHotel.address.longitude ||
      isNaN(this.newHotel.address.longitude) ||
      this.newHotel.listingPhotoPaths.length === 0 // Ensure photos are selected
    ) {
      console.error('All fields are required and numeric fields must be valid.');
      return;
    }
    let obj: { [key: string]: any } = {}; 
    
    // console.log(obj);
    const formData = new FormData();
    
    // Append the fields to the form data
    formData.append('title', this.newHotel.title);
    formData.append('description', this.newHotel.description);
    formData.append('price', this.newHotel.price.toString());

    // Address
    formData.append('address', JSON.stringify(this.newHotel.address));

    // Attach photos to form data
    for (let i = 0; i < this.newHotel.listingPhotoPaths.length; i++) {
      formData.append('listingPhotoPaths', this.newHotel.listingPhotoPaths[i]);
    }

    // Attach owner
    console.log(this.userSessionService.getUser())
    formData.append('owner', JSON.stringify(this.userSessionService.getUser()));

    // Make the HTTP POST request
    this.http.post('http://localhost:5000/hotel/create', formData).subscribe(
      (response) => {
        console.log('Hotel added successfully:', response);
        this.resetForm();
        this.navigateToHotel();
      },
      (error) => {
        console.error('Error adding Hotel:', error);
      }
    );
  }

  resetForm() {
    this.newHotel = {
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

  navigateToHotel(): void {
    this.router.navigate(['/hotels']);
  }
}
