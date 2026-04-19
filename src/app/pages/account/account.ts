import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, type OnInit } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { tablerId, tablerMail, tablerShield, tablerUserCircle } from '@ng-icons/tabler-icons';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthService } from '../../services/auth.service';
import type { UserRole } from '../../types/user.types';

@Component({
	selector: 'app-account',
	imports: [
		HlmAvatarImports,
		HlmButtonImports,
		HlmCardImports,
		HlmIconImports,
		HlmSpinnerImports,
	],
	providers: [provideIcons({ tablerId, tablerMail, tablerShield, tablerUserCircle })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './account.html',
	styleUrl: './account.css',
})
export class Account implements OnInit {
	private readonly auth = inject(AuthService);
	private readonly cdr = inject(ChangeDetectorRef);

	protected readonly currentUser = this.auth.currentUser;
	protected loading = false;
	protected error = '';

	ngOnInit(): void {
		void this.loadUser();
	}

	protected async loadUser(force = false): Promise<void> {
		this.loading = true;
		this.error = '';

		try {
			await this.auth.loadCurrentUser(force);
		} catch {
			this.error = 'Não foi possível carregar os dados da conta.';
			toast.error(this.error);
		} finally {
			this.loading = false;
			this.cdr.markForCheck();
		}
	}

	protected getInitials(name?: string): string {
		const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
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
}
