import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserSessionService } from '../login/user-session.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css'
})
export class RestaurantsComponent implements OnInit, AfterViewInit{
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
    this.http.get<any[]>(`http://localhost:5000/restaurant/user/${userId}`).subscribe(
      (response) => {
        this.contributions = response;
        console.log('Contributions fetched:', this.contributions);
      },
      (error) => {
        console.error('Error fetching contributions:', error);
      }
    );
  }

  updateRestaurant(restaurantId: string): void {
    // You can navigate to the update page or show a modal for updating the place
    this.router.navigate([`/update-restaurant/${restaurantId}`]); // Navigate to an update form
  }

  deleteRestaurant(restaurantId: string): void {
    const confirmation = confirm('Are you sure you want to delete this restaurant?');
    if (confirmation) {
      const ur = this.userSessionService.getUser();
      console.log(ur);
      this.http.delete(`http://localhost:5000/restaurant/delete/${restaurantId}`,{body:ur}).subscribe(
        () => {
          this.contributions = this.contributions.filter(restaurant => restaurant._id !== restaurantId);
          alert('restaurant deleted successfully');
        },
        (error) => {
          console.error('Error deleting restaurant:', error);
          alert('Error deleting restaurant');
        }
      );
    }
  }

  selectedRestaurant: any;
    
    viewDetails(restaurant: any) {
        this.selectedRestaurant = restaurant;
        const modal = new bootstrap.Modal(document.getElementById('restaurantDetailsLabel')!);
        modal.show();
      }

  ngAfterViewInit() {
    const modalElement = document.getElementById('restaurantDetailsModal');
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
