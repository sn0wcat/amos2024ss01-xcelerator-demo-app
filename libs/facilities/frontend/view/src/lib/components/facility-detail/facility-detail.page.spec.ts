import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideEcharts } from 'ngx-echarts';

import { FacilityDetailPage } from './facility-detail.page';

describe('DetailComponent', () => {
	let component: FacilityDetailPage;
	let fixture: ComponentFixture<FacilityDetailPage>;

	window.ResizeObserver =
		window.ResizeObserver ||
		jest.fn().mockImplementation(() => ({
			disconnect: jest.fn(),
			observe: jest.fn(),
			unobserve: jest.fn(),
		}));

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ FacilityDetailPage, HttpClientTestingModule ],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: { snapshot: { params: { id: '1' } } },
				},
				provideEcharts(),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(FacilityDetailPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
