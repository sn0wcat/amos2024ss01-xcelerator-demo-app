import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IxActiveModal, IxModule } from '@siemens/ix-angular';
@Component({
	selector: 'lib-lock-modal',
	standalone: true,
    imports: [ CommonModule, IxModule, RouterLink ],
	templateUrl: './delete-modal.component.html',
	styleUrl: './delete-modal.component.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DeleteModalComponent {
	constructor(readonly activeModal: IxActiveModal) {}
}
