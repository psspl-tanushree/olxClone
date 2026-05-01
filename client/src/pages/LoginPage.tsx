import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loginHandler } from '../store/slices/authSlice';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginHandler(data));
    if (loginHandler.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Invalid email or password');
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
          <h1 className="text-xl font-bold text-olx-text mb-5">Log in to OLX</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-olx-text mb-1">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="Enter your email"
                className="w-full border border-olx-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-olx-teal"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-olx-text mb-1">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="Enter your password"
                className="w-full border border-olx-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-olx-teal"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-olx-yellow text-olx-teal font-bold py-3 rounded hover:bg-olx-yellow-hover transition-colors disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-sm text-olx-teal hover:underline">
              Forgot password?
            </Link>
          </div>

          <p className="text-center text-sm text-olx-muted mt-4">
            New to OLX?{' '}
            <Link to="/register" className="text-olx-teal font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
