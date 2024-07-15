import { CommonModule, Location } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    Signal,
    ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { CasesFacade } from '@frontend/cases/frontend/domain';
import { FilterState, IxCategoryFilterCustomEvent, IxModule } from '@siemens/ix-angular';
import { ECasePriority, ECaseStatus, ECaseType, ICaseResponse } from 'cases-shared-models';
import { LocalStorageService } from 'common-frontend-models';
import { $enum } from 'ts-enum-util';

@Component({
	selector: 'lib-case-browse',
	standalone: true,
	imports: [ CommonModule, IxModule, RouterLink ],
	templateUrl: './case-browse.page.html',
	styleUrls: [ './case-browse.page.scss' ],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseBrowsePage {

    protected readonly repeatCategories = true;

    private readonly _statusOptions= $enum(ECaseStatus).getValues();
    protected readonly categories = {
        Status: {
            label: 'status',
            options: this._statusOptions
        },
        Priority: {
            label: 'priority',
            options: $enum(ECasePriority).getValues()
        },
        Type: {
            label: 'type',
            options: $enum(ECaseType).getValues()
        }
    };

    private readonly filter: Signal<{id: string, value: string, operator: string}[]> = computed(() =>
        this.stringToFilter(
            this._localStorageService.getOrCreate('caseFilter', 'Status,Equal,OPEN')()
        )
    );

	protected readonly cases = toSignal(this._casesFacade.getAllCases());

	protected readonly processedCases = computed(() => {
        const initialCases = this.cases();
        if (initialCases === undefined) {
            return;
        }

        const filteredCases = this.filter().reduce((cases, filter) => {
            return cases.filter(c => {
                const filterId = filter.id.toLowerCase()
                if(filterId !== 'status' && filterId !== 'type' && filterId !== 'priority')
                    return true;

                const caseValue = c[filterId];
                if (filter.operator === 'Equal') {
                    return caseValue === filter.value;
                } else {
                    return caseValue !== filter.value;
                }
            });
        }, initialCases);

        filteredCases.sort((a, b) => {
            const statusAIndex = this._statusOptions.indexOf(a.status);
            const statusBIndex = this._statusOptions.indexOf(b.status);
            return statusAIndex - statusBIndex;
        });

		return filteredCases;
	});

    protected readonly filterState = {
        tokens: [],
        categories: this.filter(),
    };

    constructor(
        protected location: Location,
        private _localStorageService: LocalStorageService,
        private _casesFacade: CasesFacade,
        private _router: Router
    ) {}

	getStatusClasses(_case: ICaseResponse) {
		return {
			'priority-emergency': _case.priority === 'EMERGENCY',
			'status-inprogress': _case.status === 'INPROGRESS',
			'status-overdue': _case.status === 'OVERDUE',
			'status-onhold': _case.status === 'ONHOLD',
			'status-done': _case.status === 'DONE',
			'status-cancelled': _case.status === 'CANCELLED',
			'status-archived': _case.status === 'ARCHIVED',
		};
	}

    filterList(event: IxCategoryFilterCustomEvent<FilterState>) {
        this._localStorageService.set('caseFilter', this.filterToString(event.detail.categories));
    }

    shortenDescription(description: string){
        if(description.length < 50) {
            return description;
        } else {
            return description.substring(0, 50) + '...';
        }
    }

    private filterToString(filter: {id: string, value: string, operator: string}[]): string {
        return filter.map((f) => f.id + ',' + f.operator + ',' + f.value).join('|');
    }

    private stringToFilter(filterString: string) {
        const filter = filterString.split('|');
        return filter.map((f) => {
            const filterParts = f.split(',');
            return { id: filterParts[0], operator: filterParts[1], value: filterParts[2] };
        })
    }

    navigateToCreateCase() {
        this._router.navigate([ '/cases/create' ]);
    }
}
