import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSessionService } from '../login/user-session.service';

@Component({
  selector: 'app-update-hotel',
  templateUrl: './update-hotel.component.html',
  styleUrl: './update-hotel.component.css'
})
export class UpdateHotelComponent implements OnInit{
  hotelToUpdate: any;
  selectedPhotos: File[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userSessionService: UserSessionService
  ) {}

  ngOnInit(): void {
    const hotelId = this.activatedRoute.snapshot.paramMap.get('id');
    if (hotelId) {
      this.getHotelDetails(hotelId);
    }
  }

  getHotelDetails(hotelId: string): void {
    this.http.get(`http://localhost:5000/hotel/hotels/${hotelId}`).subscribe(
      (response: any) => {
        this.hotelToUpdate = response;
        console.log('hotel data for update:', this.hotelToUpdate);
      },
      (error) => {
        console.error('Error fetching hotel details:', error);
      }
    );
  }

  updateHotel(): void {
    if (
      !this.hotelToUpdate.title ||
      !this.hotelToUpdate.description ||
      !this.hotelToUpdate.address.streetAddress ||
      !this.hotelToUpdate.address.city ||
      !this.hotelToUpdate.address.state ||
      !this.hotelToUpdate.address.country ||
      !this.hotelToUpdate.address.pincode ||
      isNaN(this.hotelToUpdate.address.pincode) ||
      !this.hotelToUpdate.address.latitude ||
      isNaN(this.hotelToUpdate.address.latitude) ||
      !this.hotelToUpdate.address.longitude ||
      isNaN(this.hotelToUpdate.address.longitude)
    ) {
      alert('All fields are required and numeric fields must be valid.');
      return;
    }

    const formData = new FormData();
    
    formData.append('title', this.hotelToUpdate.title);
    formData.append('description', this.hotelToUpdate.description);
    formData.append('price', this.hotelToUpdate.price.toString());
    formData.append('address', JSON.stringify(this.hotelToUpdate.address)); // Address as JSON string

    for (let i = 0; i < this.selectedPhotos.length; i++) {
      formData.append('listingPhotoPaths', this.selectedPhotos[i]);
    }

    formData.append('owner', JSON.stringify(this.userSessionService.getUser()));
    console.log(this.hotelToUpdate._id);
    this.http.put(`http://localhost:5000/hotel/update/${this.hotelToUpdate._id}`, formData).subscribe(
      (response) => {
        alert('Hotel updated successfully');
        this.router.navigate(['/hotels']);
      },
      (error) => {
        console.error('Error updating hotel:', error);
        alert('Error updating hotel');
      }
    );
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.hotelToUpdate.address.latitude = position.coords.latitude;
          this.hotelToUpdate.address.longitude = position.coords.longitude;
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

  navigateToHotel(): void {
    this.router.navigate(['/hotels']);
  }
}
