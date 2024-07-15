import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { XdCasesFacade } from '@frontend/cases/frontend/domain';
import { ECasePriority, ECaseStatus, ECaseType, ICaseResponse } from 'cases-shared-models';
import { LocalStorageService } from 'common-frontend-models';
import { of } from 'rxjs';

import { CaseBrowseComponent } from './case-browse.component';

describe('CaseBrowsComponent', () => {
	let component: CaseBrowseComponent;
	let fixture: ComponentFixture<CaseBrowseComponent>;
	let mockCasesFacade: XdCasesFacade;

	beforeEach(async () => {
		mockCasesFacade = {
			getAllCases: jest.fn().mockReturnValue(of([])),
		} as unknown as XdCasesFacade;

		await TestBed.configureTestingModule({
			imports: [ CaseBrowseComponent, HttpClientTestingModule ],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {},
				},
				{
					provide: LocalStorageService,
					useValue: {
						getOrCreate: jest.fn().mockReturnValue(signal('Status,Equal,OPEN')),
						set: jest.fn(),
					},
				},
				{ provide: XdCasesFacade, useValue: mockCasesFacade },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(CaseBrowseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('filterList', () => {
		it('should filter cases based on local storage filter', () => {
			const cases: ICaseResponse[] = [
				{
					id: 1,
					status: ECaseStatus.CANCELLED,
					priority: ECasePriority.EMERGENCY,
					type: ECaseType.ANNOTATION,
				} as ICaseResponse,
				{
					id: 2,
					status: ECaseStatus.OPEN,
					priority: ECasePriority.EMERGENCY,
					type: ECaseType.ANNOTATION,
				} as ICaseResponse,
			];
			jest.spyOn(mockCasesFacade, 'getAllCases').mockReturnValue(of(cases));
			fixture.detectChanges();

			const processedCases = component['processedCases']();
			expect(processedCases).toEqual([]);
		});
	});

	describe('getAllCases', () => {
		it('should call getAllCases from the facade', () => {
			expect(mockCasesFacade.getAllCases).toHaveBeenCalled();
		});
	});
});
