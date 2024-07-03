import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { IxModule } from '@siemens/ix-angular';
import { filter } from 'rxjs';

import { ThemeStorageService } from '../../../models/services/theme-storage.service';
import { LegalInformationComponent } from './legal-information/legal-information.component';

/**
 * Header component
 */
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [ CommonModule, IxModule, RouterLink, RouterOutlet, LegalInformationComponent ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

    private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private readonly _router: Router = inject(Router);
    private themeStorageService = inject(ThemeStorageService);
    protected lightMode = this.themeStorageService.getLightMode();

    readonly routerEvents = toSignal(
        this._router.events.pipe(filter((e) => e instanceof NavigationEnd)),
        { initialValue: null },
    );

    readonly breadcrumbs = computed(() => {
        this.routerEvents();

        const breadcrumbs = [];
        let currentRoute = this._activatedRoute.root;
        while (currentRoute.firstChild) {
            const breadcrumb = currentRoute.snapshot.data['breadcrumb'];
            if(breadcrumb && breadcrumbs[breadcrumbs.length - 1] !== breadcrumb)
                breadcrumbs.push(breadcrumb)

            currentRoute = currentRoute.firstChild;
        }

        const breadcrumb = currentRoute.snapshot.data['breadcrumb'];
        if(breadcrumb && breadcrumbs[breadcrumbs.length - 1] !== breadcrumb)
            breadcrumbs.push(breadcrumb)

        return breadcrumbs;
    });

    readonly isHomePage = computed(() => {
        this.routerEvents();
        return this._activatedRoute.snapshot.firstChild?.routeConfig?.path === '';
    });

    /**
     * from the right cut the current url until a '/' is reached n times
     * So for /cases/10/abc, goBack(1) yields /cases/10
     *
     * @param n
     */
    cutUrl(n: number) {
        const currentUrl = this._router.url;
        const urlSegments = currentUrl.split('/');
        return urlSegments.slice(0, urlSegments.length - n).join('/');
    }

    toggleMode() {
        this.themeStorageService.toggleTheme();
    }

    refresh() {
        window.location.reload();
    }
}
