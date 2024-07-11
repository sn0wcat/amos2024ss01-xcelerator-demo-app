import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BackButtonDirective } from './back-button.directive';

@Component({
	template: `<button backButton>Back</button>`,
})
class TestComponent {}

describe('BackButtonDirective', () => {
	let location: Location;
	let fixture: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ TestComponent ],
			imports: [ BackButtonDirective ],
			providers: [ Location ],
		});

		fixture = TestBed.createComponent(TestComponent);
		location = TestBed.inject(Location);
		fixture.detectChanges();
	});

	it('should create an instance', () => {
		const directive = new BackButtonDirective(location);
		expect(directive).toBeTruthy();
	});

	it('should call location.back() on click', () => {
		jest.spyOn(location, 'back');

		const button = fixture.debugElement.query(By.directive(BackButtonDirective));
		button.triggerEventHandler('click', null);

		expect(location.back).toHaveBeenCalled();
	});
});
