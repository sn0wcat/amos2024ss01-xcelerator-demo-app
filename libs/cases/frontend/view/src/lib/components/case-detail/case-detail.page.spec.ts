import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'common-frontend-models';

import { CaseDetailPage } from './case-detail.page';

describe('CaseDetailPage', () => {
	let component: CaseDetailPage;
	let fixture: ComponentFixture<CaseDetailPage>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ CaseDetailPage, HttpClientTestingModule ],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: { snapshot: { params: { handle: 'AA-000' } } },
				},
                {
                    provide: AuthenticationService,
                    useValue: jest.fn(),
                }
			],
		}).compileComponents();

		fixture = TestBed.createComponent(CaseDetailPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
