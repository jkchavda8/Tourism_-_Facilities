import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '../login/user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css'],
})
export class PlacesComponent {
  predefinedCategories: string[] = [
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
  newPlace: any = {
    title: '',
    description: '',
    price: 0,
    categories:[] ,
    address: {
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      pincode: 0,
      latitude: 0,
      longitude: 0,
    },
    placePhotoPaths: []  // To hold selected files
  };

  constructor(private http: HttpClient, private userSessionService: UserSessionService, private router:Router) {}

  toggleCategory(category: string, event: any) {
    if (event.target.checked) {
      // Add the category to the selected list
      this.newPlace.categories.push(category);
    } else {
      // Remove the category from the selected list
      this.newPlace.categories = this.newPlace.categories.filter(
        (selectedCategory : string) => selectedCategory !== category
      );
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Update latitude and longitude fields with the retrieved location
          this.newPlace.address.latitude = position.coords.latitude;
          this.newPlace.address.longitude = position.coords.longitude;
          console.log('Latitude:', this.newPlace.address.latitude, 'Longitude:', this.newPlace.address.longitude);
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
      this.newPlace.placePhotoPaths = event.target.files;
    }
  }

  addPlace() {
    // Validate fields
    if (
      !this.newPlace.title ||
      !this.newPlace.description ||
      this.newPlace.categories.length === 0 ||
      !this.newPlace.address.streetAddress ||
      !this.newPlace.address.city ||
      !this.newPlace.address.state ||
      !this.newPlace.address.country ||
      !this.newPlace.address.pincode ||
      isNaN(this.newPlace.address.pincode) ||
      !this.newPlace.address.latitude ||
      isNaN(this.newPlace.address.latitude) ||
      !this.newPlace.address.longitude ||
      isNaN(this.newPlace.address.longitude) ||
      this.newPlace.placePhotoPaths.length === 0 // Ensure photos are selected
    ) {
      console.error('All fields are required and numeric fields must be valid.');
      return;
    }
    let obj: { [key: string]: any } = {};  // Declare an empty object with dynamic keys

    // Assuming `type` is a string and contains the key name
    let type: string = 'categories';
    
    // Assign `this.newPlace.categories` to the object under the dynamic key
    obj[type] = this.newPlace.categories;
    
    // console.log(obj);
    const formData = new FormData();
    
    // Append the fields to the form data
    formData.append('title', this.newPlace.title);
    formData.append('description', this.newPlace.description);
    formData.append('price', this.newPlace.price.toString());
    formData.append('categories', obj[type]);

    // Address
    formData.append('address', JSON.stringify(this.newPlace.address));

    // Attach photos to form data
    for (let i = 0; i < this.newPlace.placePhotoPaths.length; i++) {
      formData.append('placePhotoPaths', this.newPlace.placePhotoPaths[i]);
    }

    // Attach owner
    console.log(this.userSessionService.getUser())
    formData.append('owner', JSON.stringify(this.userSessionService.getUser()));

    // Make the HTTP POST request
    this.http.post('http://localhost:5000/places/create', formData).subscribe(
      (response) => {
        console.log('Place added successfully:', response);
        this.resetForm();
        this.navigateToHome();
      },
      (error) => {
        console.error('Error adding place:', error);
      }
    );
  }

  resetForm() {
    this.newPlace = {
      title: '',
      description: '',
      price: 0,
      categories: [],
      address: {
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        pincode: 0,
        latitude: 0,
        longitude: 0,
      },
      placePhotoPaths: [], // Reset photos
    };
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  
}
