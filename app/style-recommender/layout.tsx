import Header from "@/components/header";
import Footer from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

export default function StyleRecommenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/style-recommender/" className="text-primary">
                Style Recommender
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
