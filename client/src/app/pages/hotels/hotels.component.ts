import { Component, OnInit , AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserSessionService } from '../login/user-session.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit, AfterViewInit{
  contributions: any[] = [];
  user: any;

  constructor(private http: HttpClient, private router: Router, private userSessionService: UserSessionService) {}

  ngOnInit(): void {
    this.user = this.userSessionService.getUser();  
    console.log(this.user);
    // Get user data from session
    if (this.user && this.user._id) {
      this.getUserContributions(this.user._id);  // Get contributions using user ID
    } else {
      console.error('User not logged in');
    }
  }

  // Pass userId directly in the URL
  getUserContributions(userId: string): void {
    // Make an API call to get contributions based on the user ID
    this.http.get<any[]>(`http://localhost:5000/hotel/user/${userId}`).subscribe(
      (response) => {
        this.contributions = response;
        console.log('Contributions fetched:', this.contributions);
      },
      (error) => {
        console.error('Error fetching contributions:', error);
      }
    );
  }

  updateHotel(hotelId: string): void {
    // You can navigate to the update page or show a modal for updating the place
    this.router.navigate([`/update-hotel/${hotelId}`]); // Navigate to an update form
  }

  deleteHotel(hotelId: string): void {
    const confirmation = confirm('Are you sure you want to delete this Hotel?');
    if (confirmation) {
      const ur = this.userSessionService.getUser();
      console.log(ur);
      this.http.delete(`http://localhost:5000/hotel/delete/${hotelId}`,{body:ur}).subscribe(
        () => {
          this.contributions = this.contributions.filter(hotel => hotel._id !== hotelId);
          alert('Hotel deleted successfully');
        },
        (error) => {
          console.error('Error deleting Hotel:', error);
          alert('Error deleting Hotel');
        }
      );
    }
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
