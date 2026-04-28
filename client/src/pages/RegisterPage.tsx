import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { registerHandler } from '../store/slices/authSlice';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(registerHandler(data));
    if (registerHandler.fulfilled.match(result)) {
      toast.success('Account created!');
      navigate('/');
    } else {
      toast.error('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-[80vh] bg-olx-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-block bg-olx-teal text-white font-black text-3xl px-4 py-2 rounded-md mb-2">
            OL<span className="text-olx-yellow">X</span>
          </div>
          <p className="text-olx-muted text-sm">India's #1 Buy & Sell Platform</p>
        </div>

        <div className="bg-white border border-olx-border rounded-lg p-6 shadow-sm">
          <h1 className="text-xl font-bold text-olx-text mb-5">Create your OLX account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-olx-text mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Your full name"
                className="w-full border border-olx-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-olx-teal"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-olx-text mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="your@email.com"
                className="w-full border border-olx-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-olx-teal"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-olx-text mb-1">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                placeholder="Min 6 characters"
                className="w-full border border-olx-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-olx-teal"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-olx-text mb-1">Phone <span className="text-olx-muted font-normal">(optional)</span></label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+91 XXXXX XXXXX"
                className="w-full border border-olx-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-olx-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-olx-text mb-1">City <span className="text-olx-muted font-normal">(optional)</span></label>
              <input
                {...register('city')}
                placeholder="e.g. Mumbai"
                className="w-full border border-olx-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-olx-teal"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-olx-yellow text-olx-teal font-bold py-3 rounded hover:bg-olx-yellow-hover transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-olx-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-olx-teal font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
