// src/layouts/AppLayout.jsx
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BrowserRouter } from "react-router-dom";
import BooksmarksNav from "@/context/Navbar/bookmarks-nav.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

function AppLayout({ children }) {


  return (
    <BrowserRouter>
      <SidebarProvider
      defaultOpen={false}
        style={
          {
            "--sidebar-width": "350px"
          }
        }>
        <AppSidebar />
        <SidebarInset>
          {/* <header
            className="sticky z-20 top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BooksmarksNav />
            {/*<Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </header> */}
          <div className="flex flex-1 flex-col gap-4 p-4 h-full max-h-full">

            {children}


          </div>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default AppLayout;