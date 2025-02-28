import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
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

const routes: Routes = [
  {
    path:'',
    redirectTo : 'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component: LoginComponent
  },
  { path: 'home', component: HomeComponent },
  { path: 'places', component: PlacesComponent },
  { path: 'contribute', component:ContributionComponent},
  { path: 'update-place/:id', component: UpdatePlaceComponent },
  { path : 'hotels' , component:HotelsComponent},
  { path : 'addHotel',component:AddHotelComponent},
  { path : 'update-hotel/:id', component:UpdateHotelComponent},
  { path : 'restaurants' , component:RestaurantsComponent},
  { path : 'addRestaurant', component:AddRestaurantComponent},
  { path : 'update-restaurant/:id', component:UpdateRestaurantComponent},
  { path : 'wishList', component:WishListComponent},
  { path : 'adminpage', component:AdminPageComponent},
  { path : 'nearby-hotels/:placeId', component:NearbyHotelsComponent},
  { path: 'nearby-restaurants/:placeId',component:NearbyRestaurantsComponent},
  { path : 'review/:placeId',
    component:ReviewComponent
  },
  { path: 'profile',component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
