import { Component, type OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	tablerChartBar,
	tablerCreditCard,
	tablerDashboard,
	tablerDatabase,
	tablerDots,
	tablerDotsVertical,
	tablerFileDescription,
	tablerFileWord,
	tablerFolder,
	tablerHelp,
	tablerInnerShadowTop,
	tablerListDetails,
	tablerLogout,
	tablerNotification,
	tablerReport,
	tablerSearch,
	tablerSettings,
	tablerShare3,
	tablerTrash,
	tablerUserCircle,
	tablerUsers,
	tablerUserUp
	
} from '@ng-icons/tabler-icons';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AuthService } from './services/auth.service';
import type { UserRole } from './types/user.types';


@Component({
	selector: 'app-sidebar',
	imports: [HlmSidebarImports, NgIcon, HlmIcon, HlmDropdownMenuImports, HlmAvatarImports, RouterLink],
	providers: [
		provideIcons({
			tablerInnerShadowTop,
			tablerDashboard,
			tablerListDetails,
			tablerChartBar,
			tablerFolder,
			tablerUsers,
			tablerFileDescription,
			tablerSettings,
			tablerHelp,
			tablerSearch,
			tablerDatabase,
			tablerReport,
			tablerFileWord,
			tablerDots,
			tablerShare3,
			tablerTrash,
			tablerDotsVertical,
			tablerUserCircle,
			tablerCreditCard,
			tablerNotification,
			tablerLogout,
			tablerUserUp
		}),
	],
	template: `
		<div hlmSidebarWrapper class="h-svh overflow-hidden">
			<hlm-sidebar>
				<div hlmSidebarHeader class="border-b">
					<ul hlmSidebarMenu>
						<a hlmSidebarMenuButton class="!p-1.5">
							<ng-icon hlm name="tablerInnerShadowTop" class="!size-5" />
							<span class="text-base font-semibold">MarinERP</span>
						</a>
					</ul>
				</div>

				<div hlmSidebarContent>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Home</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of _navMain; track item.title) {
									<li hlmSidebarMenuItem>
										<a hlmSidebarMenuButton [routerLink]="item.url">
											<ng-icon hlm [name]="item.icon" />
											<span>{{ item.title }}</span>
										</a>
									</li>
								}
							</ul>
						</div>
					</div>

					<!-- <div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Documents</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of _documents; track item.name) {
									<li hlmSidebarMenuItem>
										<a hlmSidebarMenuButton>
											<ng-icon hlm [name]="item.icon" />
											<span>{{ item.name }}</span>
										</a>
										<button hlmSidebarMenuAction [showOnHover]="true" [hlmDropdownMenuTrigger]="docMenu">
											<ng-icon hlm name="tablerDots" />
											<span class="sr-only">More</span>
										</button>
									</li>
								}
								<ng-template #docMenu>
									<hlm-dropdown-menu class="w-24 rounded-lg">
										<button hlmDropdownMenuItem>
											<ng-icon hlm name="tablerFolder" size="sm" />
											<span>Open</span>
										</button>
										<button hlmDropdownMenuItem>
											<ng-icon hlm name="tablerShare3" size="sm" />
											<span>Share</span>
										</button>
										<hlm-dropdown-menu-separator />
										<button hlmDropdownMenuItem variant="destructive">
											<ng-icon hlm name="tablerTrash" size="sm" />
											<span>Delete</span>
										</button>
									</hlm-dropdown-menu>
								</ng-template>
							</ul>
						</div>
					</div> -->

					<!-- <div hlmSidebarGroup class="mt-auto">
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of _navSecondary; track item.title) {
									<li hlmSidebarMenuItem>
										<a hlmSidebarMenuButton>
											<ng-icon hlm [name]="item.icon" />
											<span>{{ item.title }}</span>
										</a>
									</li>
								}
							</ul>
						</div>
					</div> -->
				</div>

				<div hlmSidebarFooter>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<a
								hlmSidebarMenuButton
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								[hlmDropdownMenuTrigger]="userMenu"
							>
								<hlm-avatar class="size-8 rounded-lg">
									<span class="rounded-lg bg-primary text-primary-foreground" hlmAvatarFallback>{{ avatarFallback }}</span>
								</hlm-avatar>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">{{ displayName }}</span>
									<span class="text-muted-foreground truncate text-xs">{{ displayEmail }}</span>
								</div>
								<ng-icon hlm name="tablerDotsVertical" class="ml-auto size-4" />
							</a>
						</li>
					</ul>
					<ng-template #userMenu>
						<hlm-dropdown-menu class="min-w-56 rounded-lg">
							<hlm-dropdown-menu-label class="p-0 font-normal">
								<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<hlm-avatar class="size-8 rounded-lg">
										<span class="rounded-lg bg-primary text-primary-foreground" hlmAvatarFallback>{{ avatarFallback }}</span>
									</hlm-avatar>
									<div class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate font-medium">{{ displayName }}</span>
										<span class="text-muted-foreground truncate text-xs">{{ displayEmail }}</span>
										@if (currentUser()?.role) {
											<span class="text-muted-foreground truncate text-xs">{{ formatRole(currentUser()?.role) }}</span>
										}
									</div>
								</div>
							</hlm-dropdown-menu-label>
							<hlm-dropdown-menu-separator />
							<hlm-dropdown-menu-group>
								<button hlmDropdownMenuItem class="cursor-pointer" (click)="goToAccount()">
									<ng-icon hlm name="tablerUserCircle" size="sm" />
									<span>Account</span>
								</button>
								<!-- <button hlmDropdownMenuItem class="cursor-pointer">
									<ng-icon hlm name="tablerCreditCard" size="sm" />
									<span>Billing</span>
								</button> -->
								<!-- <button hlmDropdownMenuItem class="cursor-pointer">
									<ng-icon hlm name="tablerNotification" size="sm" />
									<span>Notifications</span>
								</button> -->
							</hlm-dropdown-menu-group>
							<hlm-dropdown-menu-separator />
							<button hlmDropdownMenuItem class="cursor-pointer" (click)="logout()">
								<ng-icon hlm name="tablerLogout" size="sm" />
								<span>Logout</span>
							</button>
						</hlm-dropdown-menu>
					</ng-template>
				</div>
			</hlm-sidebar>
			<ng-content />
		</div>
	`,
})
export class AppSidebar implements OnInit {
	constructor(
		private readonly auth: AuthService,
		private readonly router: Router,
	) {}

	protected get currentUser() {
		return this.auth.currentUser;
	}

	ngOnInit(): void {
		void this.auth.loadCurrentUser().catch(() => undefined);
	}

	protected logout(): void {
		this.auth.logout();
		toast.info('Você saiu da conta.');
		void this.router.navigate(['/auth']);
	}

	protected goToAccount(): void {
		void this.router.navigate(['/account']);
	}

	protected get displayName(): string {
		return this.currentUser()?.name || 'Usuário';
	}

	protected get displayEmail(): string {
		return this.currentUser()?.email || 'Carregando...';
	}

	protected get avatarFallback(): string {
		const words = this.displayName.trim().split(/\s+/).filter(Boolean);
		const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join('');
		return initials || 'U';
	}

	protected formatRole(role?: UserRole): string {
		const roles: Record<UserRole, string> = {
			ADMIN: 'Administrador',
			DEVELOPER: 'Desenvolvedor',
			EMPLOYEE: 'Funcionário',
		};

		return role ? roles[role] : '-';
	}

	protected readonly _navMain = [
		{ title: 'Dashboard', url: '', icon: 'tablerDashboard' },
		{ title: 'Produtos', url: '/produtos', icon: 'tablerListDetails' },
		{ title: 'Clientes', url: '/clientes', icon: 'tablerUserUp' },
		{ title: 'Time', url: '/time', icon: 'tablerUsers' },
		{ title: 'Vendas', url: '/vendas', icon: 'tablerChartBar' },
		// { title: 'Analytics', url: '#', icon: 'tablerChartBar' },
		// { title: 'Projects', url: '#', icon: 'tablerFolder' },
	];

	protected readonly _documents = [
		{ name: 'Data Library', url: '#', icon: 'tablerDatabase' },
		{ name: 'Reports', url: '#', icon: 'tablerReport' },
		{ name: 'Word Assistant', url: '#', icon: 'tablerFileWord' },
	];

	protected readonly _navSecondary = [
		{ title: 'Settings', url: '#', icon: 'tablerSettings' },
		{ title: 'Get Help', url: '#', icon: 'tablerHelp' },
		{ title: 'Search', url: '#', icon: 'tablerSearch' },
	];
}
