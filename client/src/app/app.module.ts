import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { PlacesComponent } from './pages/places/places.component';
import { ContributionComponent } from './pages/contribution/contribution.component';
import { UpdatePlaceComponent } from './pages/update-place/update-place.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { AddHotelComponent } from './pages/add-hotel/add-hotel.component';
import { UpdateHotelComponent } from './pages/update-hotel/update-hotel.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { AddRestaurantComponent } from './pages/add-restaurant/add-restaurant.component';
import { UpdateRestaurantComponent } from './pages/update-restaurant/update-restaurant.component';
import { WishListComponent } from './pages/wish-list/wish-list.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { NearbyHotelsComponent } from './pages/nearby-hotels/nearby-hotels.component';
import { NearbyRestaurantsComponent } from './pages/nearby-restaurants/nearby-restaurants.component';
import { ReviewComponent } from './pages/review/review.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    HomeComponent,
    PlacesComponent,
    ContributionComponent,
    UpdatePlaceComponent,
    HotelsComponent,
    AddHotelComponent,
    UpdateHotelComponent,
    RestaurantsComponent,
    AddRestaurantComponent,
    UpdateRestaurantComponent,
    WishListComponent,
    AdminPageComponent,
    NearbyHotelsComponent,
    NearbyRestaurantsComponent,
    ReviewComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
