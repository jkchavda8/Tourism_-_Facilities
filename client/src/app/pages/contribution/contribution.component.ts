import { Component, OnInit,AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserSessionService } from '../login/user-session.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.css']
})
export class ContributionComponent implements OnInit, AfterViewInit {
  contributions: any[] = [];
  user: any;  // Declare user as 'any' to hold user object

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
    this.http.get<any[]>(`http://localhost:5000/places/user/${userId}`).subscribe(
      (response) => {
        this.contributions = response;
        console.log('Contributions fetched:', this.contributions);
      },
      (error) => {
        console.error('Error fetching contributions:', error);
      }
    );
  }

  selectedPlace: any;

  viewDetails(place: any) {
    this.selectedPlace = place;
    const modal = new bootstrap.Modal(document.getElementById('contributionDetailsModal')!);
    modal.show();
  }


  // Update place method
  updatePlace(placeId: string): void {
    // You can navigate to the update page or show a modal for updating the place
    this.router.navigate([`/update-place/${placeId}`]); // Navigate to an update form
  }

  // Delete place method
  deletePlace(placeId: string): void {
    const confirmation = confirm('Are you sure you want to delete this place?');
    if (confirmation) {
      const ur = this.userSessionService.getUser();
      console.log(ur);
      this.http.delete(`http://localhost:5000/places/delete/${placeId}`,{body:ur}).subscribe(
        () => {
          this.contributions = this.contributions.filter(place => place._id !== placeId);
          alert('Place deleted successfully');
        },
        (error) => {
          console.error('Error deleting place:', error);
          alert('Error deleting place');
        }
      );
    }
  }

  getStarArray(rating: number): number[] {
    const normalizedRating = Math.min(rating, 5); // Ensure max rating is 5
    const fullStars = Math.floor(normalizedRating);
    const decimalPart = normalizedRating - fullStars;
    const halfStar = decimalPart >= 0.25 && decimalPart <= 0.75 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
  
    return [...Array(fullStars).fill(1), ...Array(halfStar).fill(0.5), ...Array(emptyStars).fill(0)];
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('contributionDetailsModal');
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
