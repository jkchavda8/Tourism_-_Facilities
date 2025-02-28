import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private apiUrl = 'http://localhost:5000/places'; // Adjust your backend URL here

  constructor(private http: HttpClient) {}

  // Fetch all places
  getAllPlaces(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new place
  addPlace(placeData: any): Observable<any> {
    const formData = new FormData();
    formData.append('title', placeData.title);
    formData.append('description', placeData.description);
    formData.append('price', placeData.price);
    formData.append('category', placeData.category);
    formData.append('address', JSON.stringify(placeData.address));
    // formData.append('placePhotos', placeData.placePhotos);

    return this.http.post<any>(this.apiUrl+'/create', formData);
  }

  // Update place
  updatePlace(id: string, placeData: any): Observable<any> {
    const formData = new FormData();
    formData.append('title', placeData.title);
    formData.append('description', placeData.description);
    formData.append('price', placeData.price);
    formData.append('category', placeData.category);
    formData.append('address', JSON.stringify(placeData.address));
    // placeData.placePhotos.forEach((photo: File) => formData.append('placePhotos', photo));

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  // Delete a place
  deletePlace(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
