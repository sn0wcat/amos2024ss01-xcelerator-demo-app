import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XdCasesFacade } from '@frontend/cases/frontend/domain';
import { XdBrowseFacade } from '@frontend/facilities/frontend/domain';
import { ToastService } from '@siemens/ix-angular';
import { of } from 'rxjs';

import { CreateCaseComponent } from './create-case.component';

describe('CreateCaseComponent', () => {
    let component: CreateCaseComponent;
    let fixture: ComponentFixture<CreateCaseComponent>;
    let toastService: ToastService;
    let casesFacade: XdCasesFacade;

    beforeEach(async () => {
        const toastServiceMock = {
            show: jest.fn().mockResolvedValue(true)
        };

        const casesFacadeMock = {
            createCase: jest.fn().mockReturnValue(of({}))
        };

        const browseFacadeMock = {
            getAllFacilities: jest.fn().mockReturnValue(of([]))
        };

        await TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule, FormsModule, CreateCaseComponent ],
            providers: [
                { provide: ActivatedRoute, useValue: { snapshot: { params: { facilityId: '1' } } } },
                { provide: ToastService, useValue: toastServiceMock },
                { provide: XdCasesFacade, useValue: casesFacadeMock },
                { provide: XdBrowseFacade, useValue: browseFacadeMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateCaseComponent);
        component = fixture.componentInstance;
        toastService = TestBed.inject(ToastService);
        casesFacade = TestBed.inject(XdCasesFacade);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Initial state', () => {
        it('should initialize with facilityId from route params', () => {
            expect(component.createCaseForm.selectFacility).toBe('1');
        });

        it('should not submit form if form is invalid', () => {
            const form = {
                valid: false,
                form: {
                    value: {}
                },
                reset: jest.fn()
            } as unknown as NgForm;

            component.onSubmit(form);

            expect(component.wasValidated).toBe(true);
            expect(casesFacade.createCase).not.toHaveBeenCalled();
            expect(toastService.show).not.toHaveBeenCalled();
        });
    });

    describe('onFacilityInputChange', () => {
        it('should update facility placeholder on facility input change', () => {
            const event = { detail: 'New Facility' } as CustomEvent<string>;
            component.onFacilityInputChange(event);
            expect(component.facilityPlaceholder()).toBe('New Facility');
            expect(component.createCaseForm.selectFacility).toBe('');
        });
    });

    describe('onTypeInputChange', () => {
        it('should update type placeholder on type input change', () => {
            const event = { detail: 'New Type' } as CustomEvent<string>;
            component.onTypeInputChange(event);
            expect(component.typePlaceholder()).toBe('New Type');
            expect(component.createCaseForm.selectType).toBe('');
        });
    });

    describe('onPriorityInputChange', () => {
        it('should update priority placeholder on priority input change', () => {
            const event = { detail: 'New Priority' } as CustomEvent<string>;
            component.onPriorityInputChange(event);
            expect(component.priorityPlaceholder()).toBe('New Priority');
            expect(component.createCaseForm.selectPriority).toBe('');
        });
    });
});
