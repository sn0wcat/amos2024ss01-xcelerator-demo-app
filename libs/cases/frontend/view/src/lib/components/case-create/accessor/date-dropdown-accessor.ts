import { Component, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IxDateDropdown } from '@siemens/ix-angular';
import { IxModule } from '@siemens/ix-angular';

/**
 * This Value Accessor is needed to access the value of the date dropdown in the form
 */
@Component({
	selector: 'lib-case-date-wrapper',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DateDropdownAccessor),
			multi: true,
		},
	],
	standalone: true,
	template: `
		<ix-date-dropdown
			format="dd-MM-yyyy"
			range="false"
			(dateRangeChange)="onDateChange($event)"
		></ix-date-dropdown>
	`,
	imports: [ IxModule, FormsModule ],
})
export class DateDropdownAccessor implements ControlValueAccessor {
	@ViewChild(IxDateDropdown) private ixDateDropdown: IxDateDropdown;

	value: string;
	onChange: (value: string) => NonNullable<unknown>;
	onTouched: () => NonNullable<unknown>;

	writeValue(value: any): void {
		this.value = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	onDateChange(event: any): void {
		const dateString = this.convertDate(event.detail.from);
		const date = new Date(dateString);
		this.value = date.toISOString().slice(0, 10);
		this.onChange(this.value);
	}

	convertDate(date: string): string {
		const [ day, month, year ] = date.split('-');
		return `${year}-${month}-${day}`;
	}
}
