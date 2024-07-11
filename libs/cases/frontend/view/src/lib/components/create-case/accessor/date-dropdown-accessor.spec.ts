import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDropdownAccessor } from './date-dropdown-accessor';

describe('DateDropdownWrapperComponent', () => {
    let component: DateDropdownAccessor;
    let fixture: ComponentFixture<DateDropdownAccessor>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ DateDropdownAccessor ],
        }).compileComponents();

        fixture = TestBed.createComponent(DateDropdownAccessor);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should write value', () => {
        const value = '2024-07-10';
        component.writeValue(value);
        expect(component.value).toBe(value);
    });

    it('should register onChange function', () => {
        const onChange = jest.fn();
        component.registerOnChange(onChange);
        expect(component.onChange).toBe(onChange);
    });

    it('should register onTouched function', () => {
        const onTouched = jest.fn();
        component.registerOnTouched(onTouched);
        expect(component.onTouched).toBe(onTouched);
    });

    it('should call onChange when date changes', () => {
        const mockEvent = {
            detail: {
                from: '10-07-2024'
            }
        };

        const onChange = jest.fn();
        component.registerOnChange(onChange);

        component.onDateChange(mockEvent);

        const expectedValue = '2024-07-10';
        expect(component.value).toBe(expectedValue);
        expect(onChange).toHaveBeenCalledWith(expectedValue);
    });

    it('should convert date correctly', () => {
        const date = '10-07-2024';
        const convertedDate = component.convertDate(date);
        expect(convertedDate).toBe('2024-07-10');
    });
});
