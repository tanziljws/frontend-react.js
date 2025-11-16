import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

function VerifyEmail() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user_id from navigation state
  const userId = location.state?.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!userId) {
      setError('User ID tidak ditemukan. Silakan daftar ulang.');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyEmail(userId, code);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat verifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    navigate('/register');
  };

  const handleResendOtp = async () => {
    if (!userId) {
      setError('User ID tidak ditemukan. Silakan daftar ulang.');
      return;
    }

    setResendLoading(true);
    setResendSuccess('');
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://laravel-event-app-production-447f.up.railway.app/api'}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResendSuccess(data.message || 'Kode OTP baru telah dikirim ke email Anda. Silakan periksa inbox email Anda.');
        setError('');
      } else {
        setError(data.message || 'Gagal mengirim ulang OTP. Silakan coba lagi.');
        setResendSuccess('');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Terjadi kesalahan saat mengirim ulang OTP. Silakan coba lagi.');
      setResendSuccess('');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <button 
        onClick={handleBackToRegister}
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-blue-200 transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Kembali ke Daftar</span>
      </button>

      {/* Verify Email Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Mail className="w-16 h-16 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800">
              Edu<span className="text-blue-600">Fest</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Verifikasi Email</h2>
              <p className="text-gray-600 text-sm">
                Masukkan kode OTP yang telah dikirim ke email Anda
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {resendSuccess}
            </div>
          )}

          {/* Verify Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-gray-700">
                Kode OTP
              </label>
              <Input
                type="text"
                id="code"
                name="code"
                placeholder="180102"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength="6"
                pattern="[0-9]{6}"
                className="w-full bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 text-center text-2xl font-mono tracking-widest focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <div className="text-xs text-gray-600 text-center">
                Kode OTP terdiri dari 6 digit angka
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Memverifikasi...' : 'Verifikasi Email'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Tidak menerima kode?{' '}
              <button 
                type="button" 
                onClick={handleResendOtp}
                disabled={resendLoading || !userId}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Mengirim...' : 'Kirim ulang'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
