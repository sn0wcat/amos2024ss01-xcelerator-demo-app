import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
	standalone: true,
	imports: [ RouterModule, NgxEchartsDirective ],
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
}
