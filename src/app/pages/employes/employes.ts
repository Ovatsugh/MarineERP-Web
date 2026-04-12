import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerEdit, tablerPlus, tablerSearch, tablerTrash } from '@ng-icons/tabler-icons';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { CrudService } from '../../services/crud.service';
import { ToolsService } from '../../services/tools.service';
import { AbstractList } from '../../shared/abstract-list';
import { UserResponse } from '../../types/user.types';
import { EmployeForm, EmployeFormResult } from './employe-form/employe-form';

@Component({
  selector: 'app-employes',
  imports: [HlmAlertDialogImports, HlmButtonImports, HlmTableImports, HlmSelectImports, HlmInputImports, HlmSpinner, FormsModule, NgIcon, HlmIcon, HlmLabel],
  providers: [provideIcons({ tablerPlus, tablerEdit, tablerSearch, tablerTrash }), CrudService],
  templateUrl: './employes.html',
  styleUrl: './employes.css',
})
export class Employes extends AbstractList<UserResponse> implements OnInit {
  deletingId: string | null = null;

  constructor(
    service: CrudService,
    tools: ToolsService,
    private readonly dialog: HlmDialogService,
  ) {
    super(service, tools);
    this.service.path = 'admin/users';
  }

  ngOnInit(): void {
    this.initFromUrl();
  }

  openCreateDialog(): void {
    this.openEmployeForm();
  }

  openEditDialog(user: UserResponse): void {
    this.openEmployeForm(user);
  }

  async deleteEmploye(user: UserResponse): Promise<void> {
    this.deletingId = user.id;

    try {
      await this.service.delete(user.id);
      await this.getList();
    } finally {
      this.deletingId = null;
    }
  }

  formatRole(role?: string): string {
    const roles: Record<string, string> = {
      ADMIN: 'Administrador',
      DEVELOPER: 'Desenvolvedor',
      EMPLOYEE: 'Funcionário',
    };
    return roles[role ?? ''] ?? '-';
  }

  private openEmployeForm(user?: UserResponse): void {
    const dialogRef = this.dialog.open(EmployeForm, {
      contentClass: '!w-[96vw] !max-w-[96vw] !p-4 !gap-3 sm:!w-auto sm:!max-w-lg sm:!p-5',
      context: user ? { user } : {},
    });

    dialogRef.closed$.subscribe((result: EmployeFormResult | undefined) => {
      if (result?.refresh) {
        void this.getList();
      }
    });
  }
}
