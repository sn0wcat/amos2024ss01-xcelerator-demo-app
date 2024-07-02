import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { XdBrowseFacade } from '@frontend/facilities/frontend/domain';
import { StatusToColorRecord } from '@frontend/facilities/frontend/models';
import { IxModule } from '@siemens/ix-angular';
import { LocalStorageService } from 'common-frontend-models';
import { EPumpStatus } from 'facilities-shared-models';

@Component({
	selector: 'lib-browse',
	standalone: true,
	imports: [ CommonModule, IxModule, RouterLink ],
	templateUrl: './browse.page.html',
	styleUrl: './browse.page.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XdBrowsePage {

    private showCardListKey = 'showCardList';
	protected showCardList;
    private filterIssuesKey = 'filterIssues';
    protected filterIssues;

    protected readonly StatusToColorRecord = StatusToColorRecord;
	private readonly _browseFacade = inject(XdBrowseFacade);
	private readonly allFacilities = toSignal(this._browseFacade.getAllFacilities());
    protected readonly facilities = computed(() => {
        const facilities = this.allFacilities();
        if(!facilities)
            return undefined;

       if(this.filterIssues()) {
           return facilities.filter(facility => facility.status != EPumpStatus.REGULAR);
       } else {
           return facilities;
       }
    });

    constructor(protected readonly router: Router, protected readonly route: ActivatedRoute, private readonly browseStorageService: LocalStorageService) {
        browseStorageService.register('showCardList', false);
        this.showCardList = browseStorageService.get(this.showCardListKey);

        browseStorageService.register(this.filterIssuesKey, true);
        this.filterIssues= browseStorageService.get(this.filterIssuesKey);
    }

    toggleView() {
		this.browseStorageService.set(this.showCardListKey, !this.showCardList());
	}

    toggleFilter() {
        this.browseStorageService.set(this.filterIssuesKey, !this.filterIssues());
    }
}
