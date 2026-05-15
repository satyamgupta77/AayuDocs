import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, Trash2, Mail, UserCheck } from "lucide-react";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function AdminUsersPage() {
  const [users, whitelistedEmails] = await Promise.all([
    prisma.user.findMany({
      include: { subscription: true },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.whitelistedEmail.findMany({
      orderBy: { createdAt: "desc" }
    })
  ]);

  // Server Action to add email
  async function addWhitelist(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    if (!email) return;
    
    try {
      // Check if already exists to avoid unique constraint error
      const existing = await prisma.whitelistedEmail.findUnique({
        where: { email }
      });

      if (existing) {
        console.log(`Email ${email} is already whitelisted.`);
        return;
      }

      await prisma.whitelistedEmail.create({
        data: { email }
      });
      revalidatePath("/admin/users");
    } catch (e) {
      console.error("Error adding to whitelist:", e);
    }
  }

  // Server Action to remove email
  async function removeWhitelist(id: string) {
    "use server";
    try {
      await prisma.whitelistedEmail.delete({
        where: { id }
      });
      revalidatePath("/admin/users");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform users and VIP access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Whitelist Management */}
        <Card className="lg:col-span-1 bg-white dark:bg-slate-900 border-border dark:border-slate-800 shadow-sm self-start">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-violet-600" />
              VIP Whitelist (Free Pro)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addWhitelist} className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Add Email for Free Pro Access</label>
                <div className="flex gap-2">
                  <Input name="email" placeholder="email@example.com" type="email" required className="flex-1" />
                  <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-700">Add</Button>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Whitelisted Emails</h4>
              {whitelistedEmails.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {whitelistedEmails.map((item: any) => (
                    <div key={item.id} className="py-3 flex items-center justify-between group">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{item.email}</span>
                      </div>
                      <form action={async () => { "use server"; await removeWhitelist(item.id); }}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No whitelisted emails yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Table */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-border dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-semibold text-slate-900 dark:text-white">Registered Users</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Search users..." className="pl-9 h-9 text-sm" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Access</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => {
                  const isWhitelisted = whitelistedEmails.some((w: any) => w.email === user.email);
                  return (
                    <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{user.firstName || 'User'} {user.lastName || ''}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isWhitelisted ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 flex items-center w-fit">
                            <UserCheck size={12} className="mr-1" /> VIP PRO
                          </span>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.subscription?.plan !== 'FREE' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {user.subscription?.plan || 'FREE'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         {/* Action to whitelist directly could go here */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
