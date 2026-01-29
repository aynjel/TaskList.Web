import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GlobalStore } from '../../../../shared/store/global.store';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly globalStore = inject(GlobalStore);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isSubmitting = this.globalStore.isSubmitting;

  readonly registerForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.getRawValue();
      this.authStore.register({
        data: registerData,
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  getNameError(): string {
    const control = this.registerForm.controls.name;
    if (control.hasError('required')) {
      return 'Name is required';
    }
    if (control.hasError('minlength')) {
      return 'Name must be at least 2 characters';
    }
    return '';
  }

  getEmailError(): string {
    const control = this.registerForm.controls.email;
    if (control.hasError('required')) {
      return 'Email is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.registerForm.controls.password;
    if (control.hasError('required')) {
      return 'Password is required';
    }
    if (control.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    const control = this.registerForm.controls.confirmPassword;
    if (control.hasError('required')) {
      return 'Please confirm your password';
    }
    if (this.registerForm.hasError('passwordMismatch') && control.touched) {
      return 'Passwords do not match';
    }
    return '';
  }
}
