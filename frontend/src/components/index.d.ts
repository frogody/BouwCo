declare module '@/components/Hero' {
  export default function Hero(): JSX.Element;
}

declare module '@/components/Services' {
  export default function Services(): JSX.Element;
}

declare module '@/components/AuthForm' {
  interface AuthFormProps {
    mode: 'login' | 'signup';
    onSubmit: (data: { email: string; password: string; name?: string }) => void;
  }
  export default function AuthForm(props: AuthFormProps): JSX.Element;
}

declare module '@/components/Navigation' {
  export default function Navigation(): JSX.Element;
} 