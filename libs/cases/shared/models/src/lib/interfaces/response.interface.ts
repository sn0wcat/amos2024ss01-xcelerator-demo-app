import { ECasePriority, ECaseStatus, ECaseType } from '../enums';

export interface ICaseResponse {
	id: number;
	handle: string;
	dueDate: Date;
	title: string;
	type: ECaseType;
	status: ECaseStatus;
	assignedTo: string,
	description: string;
	source: string;
	priority: ECasePriority;
	createdBy: string;
	createdAt: Date;
	eTag: string;
	modifiedBy: string;
	updatedAt: Date;
	overdue: boolean;
	assetId: string;
}
