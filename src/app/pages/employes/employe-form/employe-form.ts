import { inject, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import {
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { CrudService } from '../../../services/crud.service';
import { ToolsService } from '../../../services/tools.service';
import { AbstractForm } from '../../../shared/abstract-form';
import { UserRequest, UserResponse } from '../../../types/user.types';

type EmployeFormContext = {
  user?: UserResponse;
  userId?: string;
};

export interface EmployeFormResult {
  refresh: boolean;
  user?: UserResponse;
}

@Component({
  selector: 'app-employe-form',
  imports: [
    FormsModule,
    HlmButton,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmInputImports,
    HlmLabel,
    HlmSpinner,
  ],
  providers: [CrudService],
  templateUrl: './employe-form.html',
})
export class EmployeForm extends AbstractForm {
  protected override readonly createSuccessMessage = 'Usuário criado com sucesso.';
  protected override readonly updateSuccessMessage = 'Usuário atualizado com sucesso.';
  protected override readonly saveErrorMessage = 'Não foi possível salvar o usuário.';

  private readonly dialogContext = injectBrnDialogContext<EmployeFormContext | undefined>({
    optional: true,
  });
  private readonly dialogRef = inject(BrnDialogRef<EmployeFormResult>, {
    optional: true,
  });

  protected readonly roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'EMPLOYEE', label: 'Funcionário' },
  ];

  protected readonly user = this.dialogContext?.user;
  protected readonly userId = this.user?.id ?? this.dialogContext?.userId;

  constructor(service: CrudService, tools: ToolsService) {
    super(service, tools);
    this.service.path = 'admin/users';
    this.dados = this.getEmptyUser();

    if (this.user) {
      this.setUserData(this.user);
    } else if (this.userId) {
      void this.loadUser(this.userId);
    }
  }

  get isEditing(): boolean {
    return !!this.userId;
  }

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload = this.getPayload();

    if (this.userId) {
      void this.update(payload, this.userId);
      return;
    }

    void this.create(payload);
  }

  finish(result: any): void {
    const user = (result?.data ?? result) as UserResponse;
    this.dialogRef?.close({ refresh: true, user });
  }

  close(): void {
    this.dialogRef?.close();
  }

  private async loadUser(userId: string): Promise<void> {
    await this.getData(userId);
    this.setUserData(this.dados);
  }

  private getPayload(): UserRequest {
    const password = String(this.dados.password ?? '').trim();
    const payload: UserRequest = {
      name: this.dados.name.trim(),
      email: this.dados.email.trim(),
      role: this.dados.role,
    };

    if (!this.isEditing || password) {
      payload.password = password;
    }

    return payload;
  }

  private getEmptyUser() {
    return {
      name: '',
      email: '',
      password: '',
      role: '',
    };
  }

  private setUserData(user?: Partial<UserResponse>): void {
    this.dados = {
      ...this.getEmptyUser(),
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      role: user?.role ?? '',
    };
  }
}
