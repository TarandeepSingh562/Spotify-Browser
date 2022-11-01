export abstract class ResourceData {
	category:string = "unknown";
	name:string;
	imageURL:string;
	id:string;
	url:string;

	constructor(objectModel:{}) {
		this.name = objectModel['name'];
		this.id = objectModel['id'];
		if(objectModel['images'] && objectModel['images'].length > 0) {
			this.imageURL = objectModel['images'][0].url;
		} else if(objectModel['album'] && objectModel['album']['images'] && objectModel['album']['images'].length > 0) {
			this.imageURL = objectModel['album']['images'][0].url;
		} else {
			this.imageURL = '../../assets/unknown.jpg';
		}

		if('spotify' in objectModel['external_urls']) {
			this.url = objectModel['external_urls']['spotify'];
		}
	}
}
