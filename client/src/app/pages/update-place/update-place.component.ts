import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSessionService } from '../login/user-session.service';

@Component({
  selector: 'app-update-place',
  templateUrl: './update-place.component.html',
  styleUrls: ['./update-place.component.css']
})
export class UpdatePlaceComponent implements OnInit {
  predefinedCategories: string[] = ['Historical Site', 'Museum', 'National Park', 'Beach', 'Mountain', 'Waterfall', 'Lake', 'Cultural Landmark', 'Wildlife Sanctuary', 'Adventure Park'];
  placeToUpdate: any = { categories: [] }; // Ensure categories array is initialized
  selectedPhotos: File[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userSessionService: UserSessionService
  ) {}

  ngOnInit(): void {
    const placeId = this.activatedRoute.snapshot.paramMap.get('id');
    if (placeId) {
      this.getPlaceDetails(placeId);
    }
  }

  // Fetch place details for the update form
  getPlaceDetails(placeId: string): void {
    this.http.get(`http://localhost:5000/places/place/${placeId}`).subscribe(
      (response: any) => {
        this.placeToUpdate = response;
        console.log('Place data for update:', this.placeToUpdate);
      },
      (error) => {
        console.error('Error fetching place details:', error);
      }
    );
  }

  updatePlace(): void {
    if (
      !this.placeToUpdate.title ||
      !this.placeToUpdate.description ||
      this.placeToUpdate.categories.length === 0 ||
      !this.placeToUpdate.address.streetAddress ||
      !this.placeToUpdate.address.city ||
      !this.placeToUpdate.address.state ||
      !this.placeToUpdate.address.country ||
      !this.placeToUpdate.address.pincode ||
      isNaN(this.placeToUpdate.address.pincode) ||
      !this.placeToUpdate.address.latitude ||
      isNaN(this.placeToUpdate.address.latitude) ||
      !this.placeToUpdate.address.longitude ||
      isNaN(this.placeToUpdate.address.longitude)
    ) {
      alert('All fields are required and numeric fields must be valid.');
      return;
    }

    const formData = new FormData();
    
    formData.append('title', this.placeToUpdate.title);
    formData.append('description', this.placeToUpdate.description);
    formData.append('price', this.placeToUpdate.price.toString());
    formData.append('categories', JSON.stringify(this.placeToUpdate.categories)); // Categories as JSON string
    formData.append('address', JSON.stringify(this.placeToUpdate.address)); // Address as JSON string

    for (let i = 0; i < this.selectedPhotos.length; i++) {
      formData.append('placePhotoPaths', this.selectedPhotos[i]);
    }

    formData.append('owner', JSON.stringify(this.userSessionService.getUser()));
    console.log(this.placeToUpdate._id);
    this.http.put(`http://localhost:5000/places/update/${this.placeToUpdate._id}`, formData).subscribe(
      (response) => {
        alert('Place updated successfully');
        this.router.navigate(['/contribute']);
      },
      (error) => {
        console.error('Error updating place:', error);
        alert('Error updating place');
      }
    );
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.placeToUpdate.address.latitude = position.coords.latitude;
          this.placeToUpdate.address.longitude = position.coords.longitude;
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

  toggleCategory(category: string, event: any): void {
    if (event.target.checked) {
      this.placeToUpdate.categories.push(category); // Add category
    } else {
      const index = this.placeToUpdate.categories.indexOf(category);
      if (index > -1) {
        this.placeToUpdate.categories.splice(index, 1); // Remove category
      }
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/contribute']);
  }

  
}
