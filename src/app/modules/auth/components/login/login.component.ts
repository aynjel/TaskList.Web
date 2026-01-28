import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalStore } from '../../../../shared/store/global.store';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly globalStore = inject(GlobalStore);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  readonly showPassword = signal(false);
  readonly isSubmitting = this.globalStore.isSubmitting;

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authStore.login({
        data: this.loginForm.getRawValue(),
        onSuccess: () => {
          this.router.navigateByUrl('/dashboard').then(() => {
            this.toastrService.success('Login successful!', 'Success');
          });
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  getEmailError(): string {
    const control = this.loginForm.controls.email;
    if (control.hasError('required')) {
      return 'Email is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.loginForm.controls.password;
    if (control.hasError('required')) {
      return 'Password is required';
    }
    if (control.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}
