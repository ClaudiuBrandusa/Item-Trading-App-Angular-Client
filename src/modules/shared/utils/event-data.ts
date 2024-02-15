export class EventData {
	name: string;
	value: any;

	constructor(name: string, value: any = undefined) {
		this.name = name;
		this.value = value;
	}
}
