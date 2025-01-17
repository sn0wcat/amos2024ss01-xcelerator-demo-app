import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IxModule } from '@siemens/ix-angular';

@Component({
	selector: 'app-not-found',
	standalone: true,
	imports: [ CommonModule, IxModule, RouterLink ],
	templateUrl: './not-found.page.html',
	styleUrl: './not-found.page.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'app-not-found',
	},
})
export class NotFoundPage {}
