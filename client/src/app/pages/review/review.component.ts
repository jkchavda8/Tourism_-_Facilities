// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { UserSessionService } from '../login/user-session.service';

// @Component({
//   selector: 'app-review',
//   templateUrl: './review.component.html',
//   styleUrl: './review.component.css'
// })
// export class ReviewComponent {

//   placeId!: string;
//   review = { rating: '', comment: '' };
//   userId!: string;
//   reviews: any[] = [];

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private router: Router,
//     private userSession: UserSessionService,
//   ) {}

//   ngOnInit() {
//     this.placeId = this.route.snapshot.paramMap.get('placeId') || '';
//     const user = this.userSession.getUser();
//     this.userId = user._id;
//     if (!sessionStorage.getItem('reloaded')) {
//       sessionStorage.setItem('reloaded', 'true');
//       location.reload();
//     } else {
//       sessionStorage.removeItem('reloaded');
//     }
//   }

//   submitReview() {
//     const reviewData = { place_id: this.placeId,user_id: this.userId,rating: this.review.rating, comment: this.review.comment};
//     this.http.post('http://localhost:5000/review/addReview', reviewData)
//       .subscribe(response => {
//         console.log('Review submitted', response);
//         this.router.navigate(['/home']); 
//       }, error => {
//         console.error('Error submitting review', error);
//       });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '../login/user-session.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  placeId!: string;
  userId!: string;
  review = { rating: 0, comment: '' };
  reviews: any[] = []; // Store reviews fetched from backend

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userSession: UserSessionService,
  ) {}

  ngOnInit() {
    this.placeId = this.route.snapshot.paramMap.get('placeId') || '';
    const user = this.userSession.getUser();
    this.userId = user?._id || '';

    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }

    this.loadReviews();
  }

  setRating(stars: number) {
    this.review.rating = stars;
  }

  submitReview() {
    const reviewData = {
      place_id: this.placeId,
      user_id: this.userId,
      rating: this.review.rating,
      comment: this.review.comment
    };

    this.http.post('http://localhost:5000/review/addReview', reviewData).subscribe(response => {
      console.log('Review submitted', response);
      this.review = { rating: 0, comment: '' }; // Reset form
      this.loadReviews(); // Reload reviews
    }, error => {
      console.error('Error submitting review', error);
    });
  }

  loadReviews() {
    this.http.get(`http://localhost:5000/review/${this.placeId}`).subscribe((data: any) => {
      if (data.success) {
        this.reviews = data.reviews;
        console.log(this.reviews);
      }
    }, error => {
      console.error('Error fetching reviews', error);
    });
  }
}
