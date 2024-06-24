import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { XdBrowseFacadesService } from '@frontend/cases/frontend/domain';
import { ECasePriority, ECaseStatus, ECaseType, ICaseResponse } from '@frontend/cases/shared/models';
import { IxModule, ModalService, ToastService } from '@siemens/ix-angular';

import DeleteModalComponent from './delete-modal/deleteModal.component';


@Component({
    selector: 'lib-detail-case',
    standalone: true,
    imports: [CommonModule, FormsModule, IxModule, RouterLink],
    templateUrl: './detail-case.component.html',
    styleUrls: ['./detail-case.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailCaseComponent {
    private readonly _browseFacade = inject(XdBrowseFacadesService);
    protected readonly _cases = toSignal(this._browseFacade.getAllCases());
    protected readonly casedetail = computed(() => {
        const _case = this._cases();
        if (_case === undefined) {
            return;
        }
        return _case.find((_case) => String(_case.id) === this.route.snapshot.params['id']);
    });

    isEditing = false;
    wasValidated = false;
    datePattern = /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/;


    constructor(private route: ActivatedRoute, private readonly _modalService: ModalService, private readonly toastService: ToastService) {
    }

    deleteCase() {
        const caseId = this.mapCaseId(this.casedetail());
        if (caseId !== undefined) {
            this._browseFacade.deleteCase(caseId).subscribe();
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

    enableEditing() {
        this.isEditing = true;
    }

    cancelEdit() {
        this.isEditing = false;
    }

    toggleEdit() {
        if (this.isEditing) {
            this.onSubmit();
        } else {
            this.isEditing = true;
        }
    }

    onSubmit(): void {
        // TODO validate form
        if (this.validateForm() === 'valid') {
            const caseId = this.mapCaseId(this.casedetail());
            const caseData = this.casedetail();

            if (caseId !== undefined && caseData !== undefined) {
                this._browseFacade.updateCase(caseId, caseData).subscribe({});
            }
            this.isEditing = false;
        } else {
            this.showErrorToast(this.validateForm());
        }
    }

    validateForm() {
        const casedetail = this.casedetail();

        if (casedetail !== undefined) {

            if (this.casedetail()?.title === '') {
                return 'Empty title';
            }


            if (casedetail.status !== undefined) {
                if (!Object.values(ECaseStatus).includes(casedetail.status)) {
                    return 'Status is not in List: OPEN, INPROGRESS, OVERDUE, ONHOLD, DONE, CANCELLED, ARCHIVED';
                }
            }
            if (casedetail.priority !== undefined) {
            if (!Object.values(ECasePriority).includes(casedetail.priority)) {
                return 'Priority is not in List: EMERGENCY, HIGH, MEDIUM, LOW';
            }}
            if (!(this.casedetail()?.modifiedBy.includes('@') && this.casedetail()?.modifiedBy.includes('.'))) {
                return 'Invalid email';
            }
            if (casedetail.type !== undefined) {
            if (!Object.values(ECaseType).includes(casedetail.type)) {
                return 'Priority is not in List: PLANNED, INNCIDENT, ANNOTATION';
            }}
            if (casedetail.dueDate !== undefined) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
            if (!this.datePattern.test(casedetail.dueDate)) {
                return 'Invalid date format';
            }}
            const dueDate = this.casedetail()?.dueDate;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (dueDate && this.datePattern.test(this.casedetail()?.dueDate)) {
                const match = this.casedetail()?.dueDate;
                if (match) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const month: int = (parseInt(match[5])) * 10 + parseInt(match[6]);
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
