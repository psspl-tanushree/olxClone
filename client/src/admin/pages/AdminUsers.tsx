import { useEffect, useState } from 'react';
import { Search, ShieldCheck, Ban, ShieldOff, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../adminApi';

type PendingAction =
  | { type: 'ban'; id: number; currentRole: string }
  | { type: 'makeAdmin'; id: number };

export default function AdminUsers() {
  const [data, setData]     = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [confirming, setConfirming] = useState(false);

  const load = (p = page, s = search) => {
    setLoading(true);
    adminApi.getUsers(p, s || undefined)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1, ''); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1, search);
  };

  const handleConfirm = async () => {
    if (!pending) return;
    setConfirming(true);
    try {
      if (pending.type === 'ban') {
        const res = await adminApi.banUser(pending.id);
        if (res.role === 'banned') {
          toast.error('User has been banned successfully');
        } else {
          toast.success('User unbanned');
        }
      } else {
        await adminApi.makeAdmin(pending.id);
        toast.success('User has been promoted to Admin');
      }
      load();
    } catch {
      toast.error('Failed');
    } finally {
      setConfirming(false);
      setPending(null);
    }
  };

  const roleBadge = (role: string) => {
    if (role === 'admin')  return 'bg-purple-100 text-purple-700';
    if (role === 'banned') return 'bg-red-100 text-red-500';
    return 'bg-green-100 text-green-700';
  };

  const confirmTitle = pending?.type === 'ban'
    ? (pending.currentRole === 'banned' ? 'Unban this user?' : 'Ban this user?')
    : 'Make this user an admin?';

  const confirmDesc = pending?.type === 'ban'
    ? (pending.currentRole === 'banned'
        ? 'This will restore the user\'s access to the platform.'
        : 'This will block the user from accessing the platform.')
    : 'This will give the user full admin privileges.';

  const confirmBtnClass = pending?.type === 'ban' && pending.currentRole !== 'banned'
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-olx-teal hover:opacity-90 text-white';

  return (
    <div className="space-y-4">
      {/* Confirm modal */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !confirming && setPending(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800">{confirmTitle}</h2>
              <button onClick={() => setPending(null)} disabled={confirming} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">{confirmDesc}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPending(null)}
                disabled={confirming}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className={`px-4 py-2 text-sm rounded-lg font-medium disabled:opacity-60 ${confirmBtnClass}`}
              >
                {confirming ? 'Please wait…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Users</h1>
        <span className="text-sm text-gray-500">{data?.total ?? '...'} total</span>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-olx-teal"
        />
        <button type="submit" className="bg-olx-teal text-white px-4 py-2 rounded-lg hover:opacity-90">
          <Search size={16} />
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['#', 'Name', 'Email', 'City', 'Role', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : data?.data.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400">{u.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-olx-teal flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{u.city || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(u.role)}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {u.role !== 'admin' && (
                      <>
                        <button
                          onClick={() => setPending({ type: 'ban', id: u.id, currentRole: u.role })}
                          className={`p-1.5 rounded transition-colors ${
                            u.role === 'banned'
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                          title={u.role === 'banned' ? 'Unban' : 'Ban'}
                        >
                          {u.role === 'banned' ? <ShieldOff size={15} /> : <Ban size={15} />}
                        </button>
                        <button
                          onClick={() => setPending({ type: 'makeAdmin', id: u.id })}
                          className="p-1.5 rounded text-purple-500 hover:bg-purple-50 transition-colors"
                          title="Make Admin"
                        >
                          <ShieldCheck size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.total > data.limit && (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => { setPage(p => p - 1); load(page - 1); }}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(data.total / data.limit)}</span>
          <button
            onClick={() => { setPage(p => p + 1); load(page + 1); }}
            disabled={page >= Math.ceil(data.total / data.limit)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
