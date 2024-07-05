import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject, Signal,
    ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { XdCasesFacade } from '@frontend/cases/frontend/domain';
import { ICaseResponse } from '@frontend/cases/shared/models';
import { FilterState, IxCategoryFilterCustomEvent, IxModule } from '@siemens/ix-angular';
import { LocalStorageService } from 'common-frontend-models';

@Component({
	selector: 'lib-brows-cases',
	standalone: true,
	imports: [ CommonModule, IxModule, RouterLink ],
	templateUrl: './case-browse.component.html',
	styleUrls: [ './case-browse.component.scss' ],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseBrowseComponent {
    private readonly defaultValue = this.filterToString([ {id: 'Status', operator:'Equal', value: 'OPEN'} ]);
    filter: Signal<{id: string, value: string, operator: string}[]> = computed(() =>
        this.stringToFilter(this.localStorage.getOrCreate('caseFilter', this.defaultValue )())
    );
    /** the category filter emits an event when it is changed, but it is also called when reloading the page
     * we need this variable to decide if we are in that initial call and don't want to change anything
     * or if we need to update our localStorage (I don't think there is another way)
     * **/
    private firstCall = true;

	protected readonly _casesFacade = inject(XdCasesFacade);
	protected readonly _cases = toSignal(this._casesFacade.getAllCases());
	protected readonly _sortedCases = computed(() => {
        let cases = this._cases();
		if (cases === undefined) {
			return;
		}

        //Hier filtern
        if (this.filter()) {
            cases = this.filterCases(cases);
        }

		cases.sort((a, b) => {
			const statusAIndex = this.statusOrder.indexOf(a.status);
			const statusBIndex = this.statusOrder.indexOf(b.status);

			if (statusAIndex === statusBIndex) {
				const priorityAIndex = this.priorityOrder.indexOf(a.priority.toUpperCase());
				const priorityBIndex = this.priorityOrder.indexOf(b.priority.toUpperCase());

				if (priorityAIndex === priorityBIndex) {
					return a.id - b.id;
				} else if (priorityAIndex === -1) {
					return 1;
				} else if (priorityBIndex === -1) {
					return -1;
				}
				return priorityAIndex - priorityBIndex;
			} else if (statusAIndex === -1) {
				return 1;
			} else if (statusBIndex === -1) {
				return -1;
			}
			return statusAIndex - statusBIndex;
		});

		return cases;
	});

    statusOrder: string[] = [
        'OPEN',
        'INPROGRESS',
        'OVERDUE',
        'ONHOLD',
        'DONE',
        'CANCELLED',
        'ARCHIVED',
    ];
    priorityOrder: string[] = [ 'EMERGENCY', 'HIGH', 'MEDIUM', 'LOW' ];

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected localStorage: LocalStorageService,
    ) {
    }

	getStatusClasses(_case: ICaseResponse) {
		return {
			emergency: _case.priority === 'EMERGENCY',
			'status-open': _case.status === 'OPEN',
			'status-inprogress': _case.status === 'INPROGRESS',
			'status-overdue': _case.status === 'OVERDUE',
			'status-onhold': _case.status === 'ONHOLD',
			'status-done': _case.status === 'DONE',
			'status-cancelled': _case.status === 'CANCELLED',
			'status-archived': _case.status === 'ARCHIVED',
		};
	}

    filterCases(cases: ICaseResponse[]): ICaseResponse[] {
        if (this.filter().length > 0) {
            this.filter().forEach((filter: {id: string, value: string, operator: string}) => {
                cases = cases.filter(c => {
                    if (filter.operator === 'Equal') {
                        if (filter.id === 'Status') {
                            return c.status === filter.value;
                        } else if (filter.id === 'Priority') {
                            return c.priority === filter.value;
                        } else if (filter.id === 'Type') {
                            return c.type === filter.value;
                        }
                    } else if (filter.operator === 'Not equal') {
                        if (filter.id === 'Status') {
                            return c.status !== filter.value;
                        } else if (filter.id === 'Priority') {
                            return c.priority !== filter.value;
                        } else if (filter.id === 'Type') {
                            return c.type !== filter.value;
                        }
                    }
                    return c;
                })
            })
        }
        return cases;
    }

    filterToString(filter: {id: string, value: string, operator: string}[]): string {
        return filter.map((f) => f.id + ',' + f.operator + ',' + f.value).join('|');
    }

    stringToFilter(filterString: string) {
        const filter = filterString.split('|');
        return filter.map((f) => {
            const filterParts = f.split(',');
            return { id: filterParts[0], operator: filterParts[1], value: filterParts[2] };
        })
    }

    repeatCategories = true;
    filterState = {
        tokens: [  ],
        categories: this.filter(),
    };
    categories = {
        Status: {
            label: 'status',
            options: [ 'OPEN', 'INPROGRESS', 'ONHOLD', 'DONE', 'OVERDUE', 'CANCELLED', 'ARCHIVED' ]
        },
        Priority: {
            label: 'priority',
            options: [ 'EMERGENCY', 'HIGH', 'MEDIUM', 'LOW' ]
        },
        Type: {
            label: 'type',
            options: [ 'PLANNED', 'INCIDENT', 'ANNOTATION' ]
        }

    };

    filterList(event: IxCategoryFilterCustomEvent<FilterState>) {
        this.localStorage.set('caseFilter', this.filterToString(event.detail.categories));
    }
}
