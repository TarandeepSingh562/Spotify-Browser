import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { CarouselCardComponent } from './components/carousel-card/carousel-card.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { SearchComponent } from './components/search/search.component';
import { ThermometerComponent } from './components/thermometer/thermometer.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { ArtistPageComponent } from './pages/artist-page/artist-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TrackPageComponent } from './pages/track-page/track-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CarouselCardComponent,
    CarouselComponent,
    SearchComponent,
    ThermometerComponent,
    TrackListComponent,
    AlbumPageComponent,
    ArtistPageComponent,
    HomePageComponent,
    TrackPageComponent
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
