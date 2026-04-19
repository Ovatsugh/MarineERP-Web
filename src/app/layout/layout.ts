import { DOCUMENT } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerMoon, tablerSun } from '@ng-icons/tabler-icons';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from '../app-sidebar';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, AppSidebar, HlmSidebarImports, HlmButtonImports, HlmIconImports],
    providers: [provideIcons({ tablerMoon, tablerSun })],
    template: `
        <app-sidebar>
            <main hlmSidebarInset>
                <header class="bg-background/90 sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                        <button hlmSidebarTrigger><span class="sr-only">Toggle sidebar</span></button>
                        <h1 class="text-base font-medium">Documents</h1>
                        <button
                            hlmBtn
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            class="ml-auto cursor-pointer"
                            [attr.aria-label]="isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'"
                            [attr.title]="isDarkTheme ? 'Tema claro' : 'Tema escuro'"
                            [attr.aria-pressed]="isDarkTheme"
                            (click)="toggleTheme()"
                        >
                            <ng-icon hlm [name]="isDarkTheme ? 'tablerSun' : 'tablerMoon'" size="sm" />
                        </button>
                    </div>
                </header>
                <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <router-outlet />
                </div>
            </main>
        </app-sidebar>
    `,
})
export class Layout implements OnInit {
    private readonly document = inject(DOCUMENT);
    private readonly themeStorageKey = 'theme';

    protected isDarkTheme = true;

    ngOnInit(): void {
        const savedTheme = this.getStoredTheme();
        this.isDarkTheme = savedTheme ? savedTheme === 'dark' : this.document.documentElement.classList.contains('dark');
        this.applyTheme();
    }

    protected toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
    }

    private applyTheme(): void {
        this.document.documentElement.classList.toggle('dark', this.isDarkTheme);
        this.setStoredTheme(this.isDarkTheme ? 'dark' : 'light');
    }

    private getStoredTheme(): string | null {
        return this.storage?.getItem(this.themeStorageKey) ?? null;
    }

    private setStoredTheme(theme: 'dark' | 'light'): void {
        this.storage?.setItem(this.themeStorageKey, theme);
    }

    private get storage(): Storage | null {
        return typeof localStorage === 'undefined' ? null : localStorage;
    }
}
