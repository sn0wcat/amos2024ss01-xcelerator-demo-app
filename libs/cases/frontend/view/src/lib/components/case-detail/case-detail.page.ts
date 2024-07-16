import { CommonModule, Location } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CasesFacade } from '@frontend/cases/frontend/domain';
import { FacilityDetailFacade } from '@frontend/facilities/frontend/domain';
import { IxModule, ModalService, ToastService } from '@siemens/ix-angular';
import { ECasePriority, ECaseStatus, ECaseType, ICaseResponse } from 'cases-shared-models';
import { AuthenticationService } from 'common-frontend-models';
import { map, switchMap } from 'rxjs';

import DeleteModalComponent from './delete-modal/delete-modal.component';

@Component({
	selector: 'lib-case-detail',
	standalone: true,
	imports: [ CommonModule, FormsModule, IxModule, RouterLink ],
	templateUrl: './case-detail.page.html',
	styleUrls: [ './case-detail.page.scss' ],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailPage {
    protected readonly caseId = this._route.snapshot.params['id'];

	protected isEditing = false;
	private readonly _datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    private readonly _emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    private readonly cases = toSignal(this._casesFacade.getAllCases());
    protected readonly caseItem = computed(() => {
        const cases = this.cases();
        if (!cases) {
            return undefined;
        }
        return cases.find((caseItem) => String(caseItem.id) === this.caseId);
    });

    private readonly _facilityObs= this._casesFacade.getAllCases().pipe(
        map((cases) => cases.find((caseItem) => String(caseItem.id) === this.caseId)),
        map((caseItem) => caseItem?.assetId ?? ''),
        switchMap((assetId) => this._facilityDetailFacade.getFacility(assetId)),
    );
    protected readonly facility = toSignal(this._facilityObs);

    protected readonly userMail = this._authenticationService.getUserEmail();

	constructor(
        protected readonly location: Location,
        private readonly _route: ActivatedRoute,
		private readonly _modalService: ModalService,
		private readonly toastService: ToastService,
        protected readonly _authenticationService: AuthenticationService,
        private readonly _casesFacade: CasesFacade,
        private readonly _facilityDetailFacade: FacilityDetailFacade
	) {}

    deleteCase() {
        // The subscribe is necessary, otherwise the request is not sent
        this._casesFacade.deleteCase({ id: this.caseId }).subscribe();
	}

	async deleting() {
		const instance = await this._modalService.open({
			content: DeleteModalComponent,
		});

		// modal closes on confirm and dismisses on cancel
		instance.onClose.on(() => {
			this.deleteCase();
		});
	}

	cancelEdit() {
		this.isEditing = false;
		window.location.reload();
	}

	toggleEdit() {
		if (this.isEditing) {
			this.onSubmit();
		} else {
			this.isEditing = true;
		}
	}

	onSubmit(): void {
		const caseItem = this.caseItem();
        if(!caseItem) {
            return;
        }

        caseItem.modifiedBy = this._authenticationService.getUserEmail();

        const validationString = this.validateForm(caseItem);
        if(validationString !== 'valid'){
            this.showErrorToast(validationString);
            return;
        }

        // The subscribe is necessary, otherwise the request is not sent
        this._casesFacade.updateCase({ id: this.caseId }, caseItem).subscribe({});
        this.isEditing = false;
	}

	validateForm(caseItem: ICaseResponse) {
        if (caseItem.title === '') {
            return 'Empty title';
        }

        if (!this._emailPattern.test(caseItem.assignedTo)) {
            return 'Invalid email for assigned to';
        }

        const dueDate = caseItem.dueDate.toString();
        if (!this._datePattern.test(dueDate)) {
            return 'Invalid date format';
        }

        const year = parseInt(dueDate.substring(0, 4));
        const month = parseInt(dueDate.substring(5, 7));
        const day = parseInt(dueDate.substring(8, 10));

        // Check if month and day are within valid ranges
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return 'Invalid month or day in due date';
        }

        // Check if the date is a valid calendar date
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            return 'Invalid date';
        }

        if (!Object.values(ECaseStatus).includes(caseItem.status)) {
            return 'Status is not in List: ' + Object.values(ECaseStatus).join(', ');
        }

        if (!Object.values(ECasePriority).includes(caseItem.priority)) {
            return 'Priority is not in List: ' + Object.values(ECasePriority).join(', ');
        }

        if (!Object.values(ECaseType).includes(caseItem.type)) {
            return 'Priority is not in List: ' + Object.values(ECaseType).join(', ');
        }

        return 'valid';
	}

	async showErrorToast(info: string) {
		await this.toastService.show({
			type: 'error',
			message: info,
		});
	}
}
