import { CommonModule, Location } from '@angular/common';
import {
	ChangeDetectionStrategy, Component, OnInit, signal, ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { faker } from '@faker-js/faker';
import { CasesFacade } from '@frontend/cases/frontend/domain';
import { FacilityBrowseFacade } from '@frontend/facilities/frontend/domain';
import { StatusToColorRecord } from '@frontend/facilities/frontend/models';
import { IxModule, IxSelectCustomEvent, ToastService } from '@siemens/ix-angular';
import { ECasePriority, ECaseStatus, ECaseType } from 'cases-shared-models';
import { AuthenticationService } from 'common-frontend-models';

import { CaseFormData } from '../interfaces/case-form-data.interface';
import { DateDropdownAccessor } from './accessor/date-dropdown-accessor';

@Component({
	selector: 'lib-case-create',
	standalone: true,
	imports: [ CommonModule, IxModule, FormsModule, RouterLink, DateDropdownAccessor ],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useClass: DateDropdownAccessor,
			multi: true,
		},
	],
	templateUrl: './case-create.page.html',
	styleUrl: './case-create.page.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseCreatePage implements OnInit {

    protected readonly StatusToColorRecord = StatusToColorRecord;

    protected wasValidated = false;
	protected selectedFacilityId: string;

    protected readonly createCaseForm = {
        selectFacility: '',
        title: '',
        dueDate: '',
        selectPriority: '',
        selectType: '',
        email: '',
        text: '',
    };

    protected readonly ECasePriority = ECasePriority;
    protected readonly ECaseType = ECaseType;

    protected readonly facilities = toSignal(this._browseFacade.getAllFacilities());

    protected readonly facilityPlaceholder = signal('Select Facility');
    protected readonly typePlaceholder = signal('Select Type');
    protected readonly  priorityPlaceholder = signal('Select Priority');

    constructor(
        protected readonly location: Location,
        private readonly _route: ActivatedRoute,
        private readonly toastService: ToastService,
        private readonly _browseFacade: FacilityBrowseFacade,
        private readonly _casesFacade: CasesFacade,
        private readonly _authenticationService: AuthenticationService,
    ) {}

    ngOnInit(){
        this.resizeObserver('input-facilitySelection', 'facilitySelection');
        this.resizeObserver('input-typeSelection', 'typeSelection');
        this.resizeObserver('input-prioritySelection', 'prioritySelection');
		this.selectedFacilityId = this._route.snapshot.params['facilityId'];
		if(this.selectedFacilityId) {
			this.createCaseForm.selectFacility = this.selectedFacilityId;
		}
    }

    /**
     * called when the user presses the Create Case Button
     */
    onSubmit(form: NgForm): void {
        this.wasValidated = true;

        if (form.valid) {
            const caseData = this.mapFormData(form.form.value);

            this._casesFacade.createCase(caseData).subscribe({
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                next: (_) => {
                    this.showSuccessToast();
                    this.wasValidated = false;
                    form.reset();
                },
            });
        }
    }

    async showSuccessToast() {
        await this.toastService.show({
            type: 'success',
            message: 'Successfully created Case'
        });
    }

    public getFacility() {
        return this.facilities()?.find(
            (facility) => facility.id === this.createCaseForm.selectFacility,
        );
    }

    private resizeObserver(inputElement: string, selectElement: string) {
        const input = document.getElementById(inputElement);
        const select = document.getElementById(selectElement)
        if (input && select) {
            new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const width = entry.contentRect.width;
                    const height = entry.contentRect.height;
                    const xPos = entry.contentRect.x;
                    const yPos = entry.contentRect.y;
                    if (input && input.style) {
                        input.style.width = `${width}px`;
                        input.style.height = `${height}px`;
                        input.style.x = `${xPos}`;
                        input.style.y = `${yPos}`;
                    }
                })
            }).observe(select);
        }
    }


    onFacilityChange(event: IxSelectCustomEvent<string | string[]>) {
        if (event.target.value !== undefined) {
            this.createCaseForm.selectFacility = event.target.value.toString();
        }
    }

    onFacilityInputChange(event: CustomEvent<string>) {
        this.createCaseForm.selectFacility = '';
        this.facilityPlaceholder.set(event.detail);
    }

    onTypeChange(event: IxSelectCustomEvent<string | string[]>) {
        if (event.target.value !== undefined) {
            this.createCaseForm.selectType = event.target.value.toString();
        }
    }

    onTypeInputChange(event: CustomEvent<string>) {
        this.createCaseForm.selectType = '';
        this.typePlaceholder.set(event.detail);
    }

    onPriorityChange(event: IxSelectCustomEvent<string | string[]>) {
        if (event.target.value !== undefined) {
            this.createCaseForm.selectPriority = event.target.value.toString();
        }
    }

    onPriorityInputChange(event: CustomEvent<string>) {
        this.createCaseForm.selectPriority = '';
        this.priorityPlaceholder.set(event.detail);
    }

    /**
     *
     * @param formData case data in the form filled in by the user
     * @returns {JSON}
     */
    private mapFormData(formData: CaseFormData) {
        return {
            assetId: formData.selectFacility,
            handle: 'AA-' + faker.number.int({ min: 1000, max: 9999 }),
            dueDate: formData.dueDate,
            title: formData.title,
            type: formData.selectType,
            status: ECaseStatus.OPEN,
            assignedTo: formData.email,
            description: formData.text,
            source: 'Internal System ' + faker.number.int({min: 1, max: 10}),
            priority: formData.selectPriority,
            createdBy: this._authenticationService.getUserEmail(),
            eTag: faker.string.alphanumeric(10),
        };
    }
}
