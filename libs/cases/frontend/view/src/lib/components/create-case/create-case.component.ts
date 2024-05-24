import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IxModule } from '@siemens/ix-angular';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { facilities } from 'libs/facilities/frontend/view/src/lib/components/facility.mocks/const';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IFacilityMock } from 'libs/facilities/frontend/view/src/lib/components/facility.mocks/facility.interface';

@Component({
	selector: 'lib-create-case',
	standalone: true,
	imports: [CommonModule, IxModule, FormsModule],
	templateUrl: './create-case.component.html',
	styleUrl: './create-case.component.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCaseComponent {
	facilities: IFacilityMock[] = facilities;

	wasValidated = false;
	value = '1';

	createCaseForm = {
		selectFacility: '',
		selectAsset: '',
		phone: '',
		email: '',
		text: '',
	};

	onSubmit(form: NgForm): void {
		this.wasValidated = true;
		if (form.form.valid) {
			//Form is valid!!
			//get all values by form.form.value
		}
	}

	public setFacilityValue(value: string) {
		this.createCaseForm.selectFacility = value;
	}

	public setAssetValue(value: string) {
		this.createCaseForm.selectAsset = value;
	}

	public setPhoneValue(value: string) {
		this.createCaseForm.phone = value;
	}

	public setEmailValue(value: string) {
		this.createCaseForm.email = value;
	}

	public getFacilityValue() {
		return this.createCaseForm.selectFacility;
	}

	public getAssetValue() {
		return this.createCaseForm.selectAsset;
	}

	public getPhoneValue() {
		return this.createCaseForm.phone;
	}

	public getEmailValue() {
		return this.createCaseForm.email;
	}

	public getTextValue() {
		return this.createCaseForm.text;
	}
}