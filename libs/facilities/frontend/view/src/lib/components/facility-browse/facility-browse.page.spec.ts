import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FacilityBrowseFacade } from '@frontend/facilities/frontend/domain';
import { of } from 'rxjs';

import { FacilityDetailPage } from '../detail/facility-detail.page';
import { FacilityBrowsePage } from './facility-browse.page';

describe('BrowseComponent', () => {
	let component: FacilityBrowsePage;
	let fixture: ComponentFixture<FacilityBrowsePage>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				FacilityBrowsePage,
				HttpClientTestingModule,
				RouterModule.forRoot([ { path: 'facilities/1', component: FacilityDetailPage } ]),
			],
			providers: [
				{
					provide: FacilityBrowseFacade,
					useValue: {
						getAllFacilities: jest
							.fn()
							.mockReturnValue(of([ { id: '1', propertySetName: 'test', cases: [] } ])),
                    },
				},
				{
					provide: ActivatedRoute,
					useValue: { snapshot: { params: { id: '1' } } },
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(FacilityBrowsePage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
