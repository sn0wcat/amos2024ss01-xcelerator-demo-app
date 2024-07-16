import { CommonModule, Location } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FacilityBrowseFacade } from '@frontend/facilities/frontend/domain';
import { StatusToColorRecord } from '@frontend/facilities/frontend/models';
import { IxModule } from '@siemens/ix-angular';
import { LocalStorageService } from 'common-frontend-models';
import { EPumpStatus } from 'facilities-shared-models';

@Component({
	selector: 'lib-facility-browse',
	standalone: true,
	imports: [ CommonModule, IxModule, RouterLink ],
	templateUrl: './facility-browse.page.html',
	styleUrl: './facility-browse.page.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacilityBrowsePage {

    protected readonly StatusToColorRecord = StatusToColorRecord;

    protected readonly showCardList = computed(() =>
        this.localStorageService.getOrCreate('showCardList', 'true')() === 'true'
    );

    protected readonly filterIssues = computed(() =>
        this.localStorageService.getOrCreate('filterIssues', 'true')() === 'true'
    );

	protected readonly allFacilities = toSignal(this._browseFacade.getAllFacilities());
    protected readonly facilities = computed(() => {
        let facilities = this.allFacilities();
        if(!facilities)
            return undefined;

        // sort them alphabetically because otherwise their order is random all the time
        facilities = facilities.sort((a, b) => a.heading.localeCompare(b.heading));

       if(this.filterIssues()) {
           facilities = facilities.filter(facility => facility.status != EPumpStatus.REGULAR);
       }

       return facilities;
    });

    constructor(
        protected readonly router: Router,
        protected readonly location: Location,
        private readonly localStorageService: LocalStorageService,
        private readonly _browseFacade: FacilityBrowseFacade,
    ) {}

    toggleView() {
		this.localStorageService.set('showCardList', (!this.showCardList()).toString());
	}

    toggleFilter() {
        this.localStorageService.set('filterIssues', (!this.filterIssues()).toString());
    }

}
