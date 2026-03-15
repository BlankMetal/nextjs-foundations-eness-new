// 'use server' marks every export in this file as a Server Action —
// these functions run ONLY on the server, never shipped to the client
'use server';

import { z } from 'zod';

// Zod 4: use top-level format validators (z.email()) instead of .string().email()
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// The shape of what we return to the client — success OR errors, never both
export type FormState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

// Server Action signature for useActionState:
// (previousState, formData) => newState
export async function submitContactForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  // safeParse returns { success, data, error } instead of throwing
  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    // Zod 4: z.treeifyError() replaces the deprecated .flatten()
    const tree = z.treeifyError(validatedFields.error);
    return {
      errors: {
        name: tree.properties?.name?.errors,
        email: tree.properties?.email?.errors,
        message: tree.properties?.message?.errors,
      },
    };
  }

  try {
    // In production: database insert, send email, call external API, etc.
    // All of this runs on the server — secrets are safe here
    console.log('Contact form submitted:', validatedFields.data);

    return {
      success: true,
      message: 'Message sent successfully!',
    };
  } catch (error) {
    // Generic message — never expose stack traces or internal details to the client
    return {
      message: 'Failed to send message. Please try again.',
    };
  }
}
