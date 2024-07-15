import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { NotFoundPage } from './not-found.page';

describe('NotFoundComponent', () => {
	let component: NotFoundPage;
	let fixture: ComponentFixture<NotFoundPage>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ NotFoundPage ],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(NotFoundPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
