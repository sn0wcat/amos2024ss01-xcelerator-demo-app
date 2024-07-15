import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CasesFacade } from '@frontend/cases/frontend/domain';
import { ECasePriority, ECaseStatus, ECaseType, ICaseResponse } from 'cases-shared-models';
import { LocalStorageService } from 'common-frontend-models';
import { of } from 'rxjs';

import { CaseBrowsePage } from './case-browse.page';

describe('CaseBrowsComponent', () => {
	let component: CaseBrowsePage;
	let fixture: ComponentFixture<CaseBrowsePage>;
	let mockCasesFacade: CasesFacade;

	beforeEach(async () => {
		mockCasesFacade = {
			getAllCases: jest.fn().mockReturnValue(of([])),
		} as unknown as CasesFacade;

		await TestBed.configureTestingModule({
			imports: [ CaseBrowsePage, HttpClientTestingModule ],
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
				{ provide: CasesFacade, useValue: mockCasesFacade },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(CaseBrowsePage);
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
