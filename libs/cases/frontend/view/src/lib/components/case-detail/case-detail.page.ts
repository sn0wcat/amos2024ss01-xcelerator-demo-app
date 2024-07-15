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
import { IxModule, ModalService, ToastService } from '@siemens/ix-angular';
import { ECasePriority, ECaseStatus, ECaseType, ICaseResponse } from 'cases-shared-models';
import { AuthenticationService } from 'common-frontend-models';

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
    protected readonly _caseId = this._route.snapshot.params['id'];

	protected isEditing = false;
	private readonly _datePattern = /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/;

    private readonly cases = toSignal(this._casesFacade.getAllCases());
    protected readonly caseItem = computed(() => {
        const caseItem = this.cases();
        if (caseItem === undefined) {
            return;
        }
        return caseItem.find((caseItem) => String(caseItem.id) === this._caseId);
    });

	constructor(
        protected readonly location: Location,
        private readonly _route: ActivatedRoute,
		private readonly _modalService: ModalService,
		private readonly toastService: ToastService,
        private readonly _authenticationService: AuthenticationService,
        private readonly _casesFacade: CasesFacade,
	) {}

	deleteCase() {
		const caseId = this.mapCaseId(this.caseItem());
		if (caseId !== undefined) {
			// The subscribe is necessary, otherwise the request is not sent
			this._casesFacade.deleteCase(caseId).subscribe();
		}
	}

	mapCaseId(_case: ICaseResponse | undefined) {
		if (_case === undefined) {
			return undefined;
		}
		return {
			id: _case.id,
		};
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

    getUserMail() {
        return this._authenticationService.getUserMail();
    }

	onSubmit(): void {
		const casedetail = this.caseItem();
        if (casedetail !== undefined) {
            casedetail.modifiedBy = <string>this.getUserMail();
        }

		if (casedetail !== undefined) {
			const validationString = this.validateForm(casedetail);
			if (validationString === 'valid') {
				const caseId = this.mapCaseId(this.caseItem());
				const caseData = this.caseItem();

				if (caseId !== undefined && caseData !== undefined) {
					// The subscribe is necessary, otherwise the request is not sent
					this._casesFacade.updateCase(caseId, caseData).subscribe({});
				}
				this.isEditing = false;
			} else {
				this.showErrorToast(validationString);
			}
		}
	}

	validateForm(casedetail: ICaseResponse) {
		if (casedetail !== undefined) {
			if (casedetail.title === '') {
				return 'Empty title';
			}

			if (!Object.values(ECaseStatus).includes(casedetail.status)) {
				return 'Status is not in List: OPEN, INPROGRESS, OVERDUE, ONHOLD, DONE, CANCELLED, ARCHIVED';
			}

			if (!Object.values(ECasePriority).includes(casedetail.priority)) {
				return 'Priority is not in List: EMERGENCY, HIGH, MEDIUM, LOW';
			}

			if (
				!(
					this.caseItem()?.modifiedBy.includes('@') &&
					this.caseItem()?.modifiedBy.includes('.')
				)
			) {
				return 'Invalid email';
			}

			if (!Object.values(ECaseType).includes(casedetail.type)) {
				return 'Priority is not in List: PLANNED, INNCIDENT, ANNOTATION';
			}

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			if (!this._datePattern.test(casedetail.dueDate)) {
				return 'Invalid date format';
			}

			const dueDate = this.caseItem()?.dueDate;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			if (dueDate && this._datePattern.test(this.caseItem()?.dueDate)) {
				const match = this.caseItem()?.dueDate;
				if (match) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					const month: int = parseInt(match[5]) * 10 + parseInt(match[6]);
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					const day = parseInt(match[8]) * 10 + parseInt(match[9]);
					if (!(month >= 1 && month <= 12 && day >= 1 && day <= 31)) {
						return 'Invalid month or day in due date';
					}
				}
			} else {
				return 'Invalid date format';
			}

			return 'valid';
		}
		return 'An error occurred :(';
	}

	async showErrorToast(info: string) {
		await this.toastService.show({
			type: 'error',
			message: info,
		});
	}
}
