import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, serviceFormSchema } from './validators';

describe('loginSchema', () => {
  it('accepts a valid login', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
  });
  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'x' }).success).toBe(false);
  });
});

describe('registerSchema', () => {
  const base = { firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '123', password: 'password1', confirmPassword: 'password1' };
  it('accepts matching passwords', () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });
  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: 'different' });
    expect(result.success).toBe(false);
  });
  it('rejects short passwords', () => {
    expect(registerSchema.safeParse({ ...base, password: 'short', confirmPassword: 'short' }).success).toBe(false);
  });
});

describe('serviceFormSchema', () => {
  it('coerces numeric fields and validates', () => {
    const result = serviceFormSchema.safeParse({
      name: 'Cut', description: 'A cut', pricePence: '3000', durationMinutes: '30', category: 'Cuts', active: true,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.pricePence).toBe(3000);
  });
});
