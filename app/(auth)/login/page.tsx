import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { AtlasLogo } from "@/components/brand/atlas-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInWithEmail } from "@/features/auth/actions";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <AtlasLogo />
          <div>
            <div className="text-sm font-semibold">Atlas</div>
            <div className="text-xs text-muted-foreground">Professional workspace access</div>
          </div>
        </div>
        <Card className="shadow-2xl shadow-black/20">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use your Supabase credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              {params.error ? (
                <div className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {params.error}
                </div>
              ) : null}
            </Suspense>
            <form action={signInWithEmail} className="space-y-3">
              <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
              <Input required name="email" type="email" placeholder="name@company.com" autoComplete="email" />
              <Input required name="password" type="password" placeholder="Password" autoComplete="current-password" />
              <Button type="submit" className="w-full">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
