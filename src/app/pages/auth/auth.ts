import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, HlmCardImports, HlmButtonImports, HlmInputImports, HlmLabel, HlmSpinner],
  templateUrl: './auth.html',
})
export class Auth {
  protected dados = { email: '', password: '' };
  protected loading = false;
  protected error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async submit(form: NgForm): Promise<void> {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const response = await this.authService.login(this.dados.email, this.dados.password);
      const { token } = response;
      this.authService.saveToken(token);
      toast.success('Login realizado com sucesso.');
      void this.router.navigate(['/']);
    } catch {
      this.error = 'E-mail ou senha inválidos.';
      toast.error(this.error);
    } finally {
      this.loading = false;
    }
  }
}
