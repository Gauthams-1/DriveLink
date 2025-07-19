import { CustomerProfile } from "@/components/CustomerProfile";
import { PartnerDashboard } from "@/components/PartnerDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">My Account</h1>
        <p className="text-muted-foreground">Manage your profile, settings, and partner activities.</p>
      </div>
      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="customer">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </TabsTrigger>
          <TabsTrigger value="partner">
            <Shield className="mr-2 h-4 w-4" />
            Partner Dashboard
          </TabsTrigger>
        </TabsList>
        <TabsContent value="customer" className="mt-6">
          <CustomerProfile />
        </TabsContent>
        <TabsContent value="partner" className="mt-6">
          <PartnerDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
