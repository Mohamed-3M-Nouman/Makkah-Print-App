'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData): Promise<{ error?: string } | void> {
    const phone = formData.get('phone') as string;

    /* SUPABASE BYPASS - MOCK CUSTOMER LOGIN */
    console.log('Customer Login Attempt:', { phone });

    // Simulate slight delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const cookieStore = await cookies();

    // Set standard user cookie
    cookieStore.set('user_role', 'customer', { path: '/' });

    revalidatePath('/', 'layout');
    redirect('/home');
}

export async function signup(formData: FormData): Promise<{ error?: string } | void> {
    /* SUPABASE BYPASS - MOCK SIGNUP */
    console.log('Mock Signup Attempt for:', formData.get('email'))

    // Simulate slight delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const cookieStore = await cookies();
    cookieStore.set('user_role', 'customer', { path: '/' });

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signout(): Promise<void> {
    /* SUPABASE BYPASS - MOCK SIGNOUT */
    const cookieStore = await cookies();
    cookieStore.delete('user_role');

    revalidatePath('/', 'layout')
    redirect('/')
}
