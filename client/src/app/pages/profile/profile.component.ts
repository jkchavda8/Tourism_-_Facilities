import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '../login/user-session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: any = {};
  updatedUser: any = {};
  profileImage: File | null = null;
  apiUrl = 'http://localhost:5000/user/update-profile'; // Backend API to update user details

  constructor(private http: HttpClient, private userSession: UserSessionService) {}

  ngOnInit(): void {
    const sessionUser = this.userSession.getUser();
    if (sessionUser) {
      this.user = { ...sessionUser };
      this.updatedUser = { ...sessionUser };
    }
  }

  onFileChange(event: any): void {
    this.profileImage = event.target.files[0];
  }

  updateProfile(): void {
    const formData = new FormData();
    formData.append('firstName', this.updatedUser.firstName);
    formData.append('lastName', this.updatedUser.lastName);
    formData.append('email', this.updatedUser.email);
    if (this.profileImage) {
      formData.append('profileImage', this.profileImage);
    }

    this.http.post(this.apiUrl+ '/' + this.user._id, formData).subscribe(
      (response: any) => {
        alert('Profile updated successfully!');
        console.log(response.user)
        this.userSession.setUser(response.user);
        this.userSession.setAuthToken(response.authToken);
        if (!sessionStorage.getItem('reloaded')) {
          sessionStorage.setItem('reloaded', 'true');
          location.reload();
        } else {
          sessionStorage.removeItem('reloaded');
        }
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }
}
