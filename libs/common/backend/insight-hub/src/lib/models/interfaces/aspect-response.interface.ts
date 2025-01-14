export interface IAspectResponse {
	_embedded: Embedded;
	_links: Links;
	page: Page;
}

interface Page {
	size: number;
	totalElements: number;
	totalPages: number;
	number: number;
}

interface Links {
	self: Self;
}

interface Self {
	href: string;
}

interface Embedded {
	aspects: Aspect[];
}

export interface Aspect {
	name: string;
	aspectId: string;
	holderAssetId: string;
	aspectTypeId: string;
	aspectTypeName: string;
	category: string;
	description: string;
	variables: AspectVariable[];
}

export interface AspectVariable {
	name: string;
	dataType: string;
	unit: string;
	searchable: boolean;
	length: null | number;
	qualityCode: boolean;
	defaultValue: null;
}
