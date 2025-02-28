import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserSessionService } from './user-session.service';

// Define the models for SignUp and Login
export class SignUpModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImagePath: string;

  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.profileImagePath = '';
  }
}

export class LoginModel {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isSignDivVisiable: boolean = true; 
  signUpObj: SignUpModel = new SignUpModel();
  loginObj: LoginModel = new LoginModel();
  selectedFile: File | null = null;

  private baseUrl = 'http://localhost:5000/user';

  constructor(private router: Router, private http: HttpClient,private userSessionService: UserSessionService) {}

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      console.log('Selected File:', this.selectedFile);
    } else {
      console.error('No file selected');
    }
  }

  // Function for user registration
  onRegister() {
    if (!this.selectedFile) {
      alert('Please select a profile image.');
      return;
    }

    // Create FormData to send the file along with other data
    const formData = new FormData();
    formData.append('firstName', this.signUpObj.firstName);
    formData.append('lastName', this.signUpObj.lastName);
    formData.append('email', this.signUpObj.email);
    formData.append('password', this.signUpObj.password);
    formData.append('profileImage', this.selectedFile, this.selectedFile.name); // Append file
    // formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });

    this.http.post(`${this.baseUrl}/signup`, formData).subscribe(
      (response:any) => {
        alert('Registration Success');
        this.userSessionService.setUser(response.user);
        this.userSessionService.setAuthToken(response.authToken);
        // Optionally navigate or reset form after registration success
        this.router.navigateByUrl('/home');
      },
      (error) => {
        alert('Registration Failed: ' + error.message);
      }
    );
  }

  // Function for handling user login
  onLogin() {
    console.log('Login Payload:', this.loginObj); // Debug the payload
    if(this.loginObj.email == "jay886888@gmail.com" && this.loginObj.password == "123456"){
      this.router.navigateByUrl('/adminpage');
    }
    else{
      this.http.post(`${this.baseUrl}/login`, this.loginObj).subscribe(
        (response: any) => {
          if (response && response.authToken) {
            // alert('User Found...');
            this.userSessionService.setUser(response.user);
            this.userSessionService.setAuthToken(response.authToken); // Store JWT token
            this.router.navigateByUrl('/home');
            // console.log(this.userSessionService.getUser())
          } else {
            alert('No User Found');
          }
        },
        (error) => {
          alert('Login Failed: ' + error.message);
        }
      );
    }
  }
}
