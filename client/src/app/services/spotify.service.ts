import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    let myRequest = this.http.get(this.expressBaseUrl+endpoint).toPromise();
    return Promise.resolve(myRequest);
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    var allData;
    var encodedSearch = `/search/${category}/${encodeURIComponent(resource)}}`;
    if (category === 'album'){
      allData = this.sendRequestToExpress(encodedSearch).then((searchData) => {
        return searchData['albums']['items'].map(((searchData) => new AlbumData(searchData)));
      })
    }
    else if (category == 'artist'){
      allData = this.sendRequestToExpress(encodedSearch).then((searchData)=> {
        return searchData['artists']['items'].map(((searchData) => new ArtistData(searchData)));
      })
    }
    else if (category == 'track'){
      allData = this.sendRequestToExpress(encodedSearch).then((searchData)=> {
        return searchData['tracks']['items'].map(((searchData) => new TrackData(searchData)));
      })
    }

    return allData;
  }

  getArtist(artistId:string):Promise<ArtistData> {
    // artist endpoint to make a request to express.
    var encodedSearch = `/artist/${encodeURIComponent(artistId)}`;
    var getArtistSearch = this.sendRequestToExpress(encodedSearch).then((data) => {
      return data;
    });

    return getArtistSearch;
  }
  
  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    var encodedSearch = `/artist-related-artists/${encodeURIComponent(artistId)}`;
    var getArtistRelatedSearch = this.sendRequestToExpress(encodedSearch).then((data) => {
      return data['artists'].map((r:any) => new ArtistData(r))
    });
    
   return getArtistRelatedSearch;
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //use the top tracks endpoint to make a request to express.
    var encodedSearch = `/artist-top-tracks/${encodeURIComponent(artistId)}`;
    var getTopTracksForArtist  = this.sendRequestToExpress(encodedSearch).then((data) => {
      return data['tracks'].map((t:any) => new TrackData(t) )
    });

    return getTopTracksForArtist;
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //use the albums for an artist endpoint to make a request to express.
    var encodedSearch = `/artist-albums/${encodeURIComponent(artistId)}`;
    var getArtistAlbums  = this.sendRequestToExpress(encodedSearch).then((data) => {
      return data['items'].map((a:any) => new AlbumData(a))
    });

    return getArtistAlbums;
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //use the album endpoint to make a request to express.
    var encodedSearch = `/album/${encodeURIComponent(albumId)}`;
    var getAlbumSearch = this.sendRequestToExpress(encodedSearch).then((data) => {
      return data;
    });

    return getAlbumSearch;
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //use the tracks for album endpoint to make a request to express.
    var encodedSearch = `/album-tracks/${encodeURIComponent(albumId)}`;
    var getTracksAlbum = this.sendRequestToExpress(encodedSearch).then((data) => {
      return data['items'].map((t:any) => new TrackData(t))
    });

    return getTracksAlbum;
  }

  getTrack(trackId:string):Promise<TrackData> {
    //use the track endpoint to make a request to express.
    var encodedSearch = `/track/${encodeURIComponent(trackId)}`;
    var getTracks = this.sendRequestToExpress(encodedSearch).then((data) => {
      return new TrackData(data);
    });

    return getTracks;
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    // use the audio features for track endpoint to make a request to express.
    var encodedSearch = `/track-audio-features/${encodeURIComponent(trackId)}`;
    var getTrackAudioData = this.sendRequestToExpress(encodedSearch).then((data) => {
      return TrackFeature.FeatureTypes.map((feature:any) => {
        return new TrackFeature(feature, data[feature])
      
      })
    });
    return getTrackAudioData;
  }
}

