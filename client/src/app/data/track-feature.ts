import * as chroma from 'chroma-js';

export class TrackFeature {
	static FeatureTypes = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence'];

	id:string;
	name:string;
	percent:number;

	constructor(feature:string, percent:number) {
		this.name = feature;
		this.percent = percent;
	}

	get percentageString() {
		return (this.percent*100).toFixed() + '%';
	}

	get color() {
		return chroma.mix('red', 'green', this.percent, 'hsl').hex();
	}
}
