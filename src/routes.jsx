import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
// Core and Authentication Components
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { Unauthorized, TooManyRequests } from "@/components";
const UpdateVanLoadingDemand = lazy(() => import("./pages/Documents/VanLoadingDemands/update/UpdateVanLoadingDemand.jsx"));
const AddVanLoadingDemand = lazy(() => import("./pages/Documents/VanLoadingDemands/create/AddVanLoadingDemand.jsx"));
const LoadingDemandDocuments = lazy(() => import("./pages/Documents/views/LoadingDemandDocuments/LoadingDemandDocuments.jsx"))
const UserPasswordManagement = lazy(() => import("./pages/UserPasswordManagement/UserPasswordManagement.jsx"));
const CustomerFamiliesView = lazy(() => import("./pages/CustomerFamilies/view/customer-families-view.jsx"));
const CustomerCategoriesView = lazy(() => import("./pages/CustomerCategories/view/customer-categories-view.jsx"));
const ProductsCategoriesView = lazy(() => import("./pages/ProductCategories/view/product-categories-view.jsx"));
const ProductsMarquesView = lazy(() => import("./pages/ProductMarques/view/product-marques-view.jsx"));
const ProductsFamiliesView = lazy(() => import("./pages/ProductFamilies/view/product-families-view.jsx"));
const NotFound = lazy(() => import("./pages/Erreur/NotFound"));
const Profile = lazy(() => import('./pages/Profile/Profile.jsx'));
const MobilePresentation = lazy(() => import("./pages/Mobile/Presentation.jsx"));
const Account = lazy(() => import("./pages/Settings/account/account.jsx"));
// User Management and Access Control
const UserManagement = lazy(() => import('./pages/UserManagement/UserManagement.jsx'));
const RolesView = lazy(() => import('./pages/Roles/view/RolesView.jsx'));
const AddRole = lazy(() => import('./pages/Roles/create/AddRole.jsx'));
const UpdateRole = lazy(() => import('./pages/Roles/update/UpdateRole.jsx'));
const PermissionsView = lazy(() => import('./pages/Permissions/view/PermissionsView.jsx'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const DefaultParameters = lazy(() => import('./pages/Settings/DefaultParameters/DefaultParameters.jsx'));

// Agent Management
const AgentsView = lazy(() => import("./pages/Agents/view/AgentsView"));
const AddAgent = lazy(() => import("./pages/Agents/create/AddAgent"));
const UpdateAgent = lazy(() => import("./pages/Agents/update/UpdateAgent"));
const PresellersView = lazy(() => import("./pages/Agents/view/Presellers/PresellersView"));
const ProductAgentPermission = lazy(() => import("./pages/ProductAgentPermission/ProductAgentPermission"));

// Customer Management
const CustomersView = lazy(() => import("@/pages/Customers/view/CustomersView"));
const AddCustomer = lazy(() => import("./pages/Customers/create/AddCustomer"));
const UpdateCustomer = lazy(() => import("./pages/Customers/update/UpdateCustomer"));
const CustomerChrono = lazy(() => import("./pages/Chrono/Customer/CustomerChrono"));
const CustomersSituation = lazy(() => import("./pages/CustomersSituation/CustomersSituation"));


// Supplier Management
const SuppliersView = lazy(() => import("@/pages/Suppliers/view/SuppliersView"));
const AddSupplier = lazy(() => import("./pages/Suppliers/create/AddSupplier"));
const UpdateSupplier = lazy(() => import("./pages/Suppliers/update/UpdateSupplier"));
const SupplierChrono = lazy(() => import("./pages/Chrono/Supplier/SupplierChrono"));
const SuppliersSituation = lazy(() => import("./pages/SuppliersSituation/SuppliersSituation"));

// Product Management
const ProductsView = lazy(() => import("./pages/Products/view/ProductsView"));
const AddProduct = lazy(() => import("./pages/Products/create/AddProduct"));
const UpdateProduct = lazy(() => import("./pages/Products/update/UpdateProduct"));
const ProductChrono = lazy(() => import("./pages/Chrono/Product/ProductChrono"));
const ProductPricing = lazy(() => import("./pages/ProductPricings/ProductPricings"));
const ProductWarehouses = lazy(() => import("./pages/ProductWarehouses/ProductWarehouses"));

// Warehouse Management
const WarehousesView = lazy(() => import("./pages/Warehouses/view/WarehousesView"));
const AddWarehouse = lazy(() => import("./pages/Warehouses/create/AddWarehouse"));
const UpdateWarehouse = lazy(() => import("./pages/Warehouses/update/UpdateWarehouse"));

// Vehicle and Tour Management
const VehiclesView = lazy(() => import('./pages/Vehicles/view/VehiclesView'));
const AddVehicle = lazy(() => import('./pages/Vehicles/create/AddVehicle'));
const UpdateVehicle = lazy(() => import('./pages/Vehicles/update/UpdateVehicle'));
const ToursView = lazy(() => import("./pages/Tours/view/TourView"));
const ToursCustomers = lazy(() => import("./pages/Tours/view/tours-customers/ToursCustomers.jsx"));
const AddTour = lazy(() => import("./pages/Tours/create/AddTour"));
const UpdateTour = lazy(() => import("./pages/Tours/update/UpdateTour"));
const RoutesView = lazy(() => import("./pages/Routes/view/RoutesView"));
const AddRoute = lazy(() => import("./pages/Routes/create/AddRoute"));
const UpdateRoute = lazy(() => import("./pages/Routes/update/UpdateRoute"));

// Company Management
const CompaniesView = lazy(() => import("./pages/Companies/view/CompaniesView"));
const AddCompany = lazy(() => import("./pages/Companies/create/AddCompany"));
const UpdateCompany = lazy(() => import("./pages/Companies/update/UpdateCompany"));

// Financial Management
const MoneyTransfer = lazy(() => import("./pages/MoneyTransfer"));
const Transactions = lazy(() => import("./pages/Transactions/view/Transactions"));
const AddCollection = lazy(() => import("./pages/Transactions/collection/create/AddCollection"));
const UpdateCollection = lazy(() => import("./pages/Transactions/collection/update/UpdateCollection.jsx"));
const AddDisbursement = lazy(() => import("./pages/Transactions/disbursement/create/AddDisbursement"));
const UpdateDisbursement = lazy(() => import("./pages/Transactions/disbursement/update/UpdateDisbursement.jsx"));
const MoneyBoxesView = lazy(() => import("./pages/MoneyBoxes/view/MoneyBoxesView"));
const AddingMoneyBox = lazy(() => import("./pages/MoneyBoxes/create"));
const MoneyBoxSessions = lazy(() => import("./pages/MoneyBoxSessions"));

// Document Management - Sales & Billing
const SalesDocumentsView = lazy(() => import("./pages/Documents/views/SaleDocuments/SalesDocumentsView.jsx"));
const SalesBillingDocumentsView = lazy(() => import("./pages/Documents/views/SalesBillingDocuments/SalesBillingDocuments.jsx"));
const PurchasesBillingDocumentsView = lazy(() => import("./pages/Documents/views/PurchasesBillingDocuments/PurchasesBillingDocuments.jsx"));
const AddBill = lazy(() => import("./pages/Documents/Bill/create/AddBill.jsx"));
const UpdateBill = lazy(() => import('./pages/Documents/Bill/update/UpdateBill.jsx'));
const AddBillSupplier = lazy(() => import('./pages/Documents/BillSupplier/create/AddBillSupplier.jsx'));
const UpdateBillSupplier = lazy(() => import('./pages/Documents/BillSupplier/update/UpdateBillSupplier.jsx'));
// Document Management - Proforma & Commands
const SalesProformaDocuments = lazy(() => import('./pages/Documents/views/SalesProformaDocuments/SalesProformaDocuments.jsx'));
const PurchasesProformaDocuments = lazy(() => import('./pages/Documents/views/PurchasesProformaDocuments/PurchasesProformaDocuments.jsx'));
const SalesCommandsDocumentsView = lazy(() => import('./pages/Documents/views/SalesCommandsDocuments/SalesCommandsDocuments.jsx'));
const PurchasesCommandsDocumentsView = lazy(() => import('./pages/Documents/views/PurchasesCommandsDocuments/PurchasesCommandsDocuments.jsx'));
const AddProformaCustomer = lazy(() => import('./pages/Documents/ProformaCustomer/create/AddProformaCustomer.jsx'));
const UpdateProformaCustomer = lazy(() => import("./pages/Documents/ProformaCustomer/update/UpdateProformaCustomer.jsx"));
const AddProformaSupplier = lazy(() => import('./pages/Documents/ProformaSupplier/create/AddProformaSupplier.jsx'));
const UpdateProformaSupplier = lazy(() => import("./pages/Documents/ProformaSupplier/update/UpdateProformaSupplier.jsx"));
const AddCommandCustomer = lazy(() => import("./pages/Documents/CommandCustomer/create/AddCommandCustomer.jsx"));
const UpdateCommandCustomer = lazy(() => import("./pages/Documents/CommandCustomer/update/UpdateCommandCustomer.jsx"));
const AddCommandSupplier = lazy(() => import('./pages/Documents/CommandSupplier/create/AddCommandSupplier.jsx'));
const UpdateCommandSupplier = lazy(() => import('./pages/Documents/CommandSupplier/update/UpdateCommandSupplier.jsx'));

// Document Management - Delivery & Reception
const AddDelivery = lazy(() => import("./pages/Documents/Delivery/create/AddDelivery"));
const UpdateDelivery = lazy(() => import("./pages/Documents/Delivery/update/UpdateDelivery"));
const PurchaseDocumentsView = lazy(() => import("./pages/Documents/views/PurchaseDocuments/PurchaseDocumentsView.jsx"));
const AddReception = lazy(() => import("./pages/Documents/Reception/create/AddReception"));
const UpdateReception = lazy(() => import("./pages/Documents/Reception/update/UpdateReception"));

// Document Management - Returns
const AddReturnClient = lazy(() => import("./pages/Documents/ReturnClient/create/AddReturnClient"));
const UpdateReturnClient = lazy(() => import("./pages/Documents/ReturnClient/update/UpdateReturnClient"));
const AddReturnSupplier = lazy(() => import("./pages/Documents/ReturnSupplier/create/AddReturnSupplier"));
const UpdateReturnSupplier = lazy(() => import("./pages/Documents/ReturnSupplier/update/UpdateReturnSupplier"));
const AddBillSupplierReturn = lazy(() => import("./pages/Documents/BillSupplierReturn/create/AddBillSupplierReturn"));
const UpdateBillSupplierReturn = lazy(() => import("./pages/Documents/BillSupplierReturn/update/UpdateBillSupplierReturn"));
const AddBillCustomerReturn = lazy(() => import("./pages/Documents/BillCustomerReturn/create/AddBillCustomerReturn"));
const UpdateBillCustomerReturn = lazy(() => import("./pages/Documents/BillCustomerReturn/update/UpdateBillCustomerReturn"));

// Document Management - Stock & Inventory
const InventoriesView = lazy(() => import('./pages/Inventory/view/InventoriesVIew.jsx'));
const AddInventory = lazy(() => import('./pages/Inventory/create/AddInventory'));
const UpdateInventory = lazy(() => import('./pages/Inventory/update/UpdateInventory.jsx'));
const AddMissingStock = lazy(() => import("./pages/Documents/MissingStock/create/AddMissingStock"));
const UpdateMissingStock = lazy(() => import("./pages/Documents/MissingStock/update/UpdateMissingStock"));
const AddExcessStock = lazy(() => import("./pages/Documents/ExcessStock/create/AddExcessStock"));
const UpdateExcessStock = lazy(() => import("./pages/Documents/ExcessStock/update/UpdateExcessStock"));
const RegularizationDocumentsView = lazy(() => import("./pages/Documents/views/RegularizationDocuments/RegularizationDocumentsView.jsx"));

// Document Management - Loading & Transfer
const LoadingDocumentsView = lazy(() => import("./pages/Documents/views/LoadingDocuments/LoadingDocumentsView.jsx"));
const UnloadingDocumentsView = lazy(() => import("./pages/Documents/views/UnloadingDocuments/UnloadingDocumentsView.jsx"));
const TransferDocumentsView = lazy(() => import("./pages/Documents/views/TransferDocuments/TransferDocumentsView.jsx"));
const VanLoadingView = lazy(() => import("./pages/Documents/VanLoading/view/VanLoadingView"));
const AddVanLoadingFastCreate = lazy(() => import("./pages/Documents/VanLoading/create/AddVanLoading.jsx"));
const VanLoadingFastUpdate = lazy(() => import("./pages/Documents/VanLoading/update/UpdateVanLoading.jsx"));
const UpdateVanUnloading = lazy(() => import("./pages/Documents/VanUnLoading/update/UpdateVanUnloading.jsx"));
const VanUnloadingView = lazy(() => import("./pages/Documents/VanUnLoading/view/VanUnloadingView"));
const AddVanUnLoading = lazy(() => import("./pages/Documents/VanUnLoading/create/AddVanUnLoading"));
const AddTransfer = lazy(() => import("./pages/Documents/Transfer/create/AddTransfer.jsx"));
const UpdateProductTransfer = lazy(() => import("./pages/Documents/Transfer/update/UpdateProductTransfer.jsx"));
const DocumentTransformationsView = lazy(() => import('./pages/Documents/Transformations/view/DocumentTransformationsView'));
const AddDocumentTransformation = lazy(() => import("./pages/Documents/Transformations/create/AddDocumentTransformation"));
const LogisticDocumentsView = lazy(() => import("./pages/Documents/views/LogisticDocuments/LogisticDocumentsView.jsx"))
const OrganizationalChart = lazy(() => import("./pages/Chart/OrganizationalChart"));


// Miscellaneous Features
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const BatchView = lazy(() => import("./pages/Batch/view/BatchView"));
const AddBatch = lazy(() => import("./pages/Batch/create/AddBatch"));

const CurrenciesView = lazy(() => import("./pages/Currencies/view/currencies-view.jsx"));
const ActivitiesView =lazy(()=>import("./pages/Activities/view/activities-view.jsx"));
const LegalFormsView = lazy(() => import("./pages/LegalForms/view/legal-forms-view.jsx"))
const VatsView = lazy(() => import("./pages/Vats/view/vats-view.jsx"))

const UpdateBatch = lazy(() => import("./pages/Batch/update/UpdateBatch"));
const Quota = lazy(() => import("./pages/Quota/Quota"));
const MissionsView = lazy(() => import("./pages/Missions/view/MissionsView"));
const AddMission = lazy(() => import("./pages/Missions/create/AddMission"));
const UpdateMission = lazy(() => import("./pages/Missions/update/UpdateMission"));
const MissionDetails = lazy(() => import('./pages/Missions/details/MissionDetails.jsx'));
const PromotionView = lazy(() => import("./pages/Promotion/view/PromotionsView.jsx"));
const PromotionDetails = lazy(() => import("./pages/Promotion/detail/PromotionDetails.jsx"));
const AddPromotion = lazy(() => import('./pages/Promotion/create/AddPromotion.jsx'));
const UpdatePromotion = lazy(() => import("./pages/Promotion/update/UpdatePromotion.jsx"));

const BankingStatusView = lazy(() => import("./pages/BankingStatus/view/BankingStatusView"));

const AuditTrailProductCreation = lazy(() => import("@/pages/Audits/pages/Create-products-audits"));
const AuditeDocumentsDelete = lazy(() => import("@/pages/Audits/pages/Documents/AuditDocumentsDelete/AuditDocumentsDelete"));

const AuditeDocumentsCreate= lazy(() => import("@/pages/Audits/pages/Documents/AuditDocumentsCreate/AuditDocumentsCreate"));

const AuditeDocumentsUpdate= lazy(() => import("@/pages/Audits/pages/Documents/AuditDocumentsUpdate/AuditDocumentsUpdate"));



function AppRoutes() {
    return (
        <Routes>
            {/* Authentication and Core Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/too-many-requests" element={<TooManyRequests />} />
            <Route path="*" element={<NotFound />} />

            {/* User Management and Access Control */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/user-passwords" element={<UserPasswordManagement />} />
            <Route path="/roles" element={<RolesView />} />
            <Route path="/roles/create" element={<AddRole />} />
            <Route path="/roles/:id/update" element={<UpdateRole />} />
            <Route path="/permissions" element={<PermissionsView />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/default-parameters" element={<DefaultParameters />} />
            <Route path="/settings/account" element={<Account />} />

            {/* Agent Management */}
            <Route path="/agents" element={<AgentsView />} />
            <Route path="/agents/create" element={<AddAgent />} />
            <Route path="/agents/:id/update" element={<UpdateAgent />} />
            <Route path="/agents/presellers" element={<PresellersView />} />
            <Route path="/agents/products/permissions" element={<ProductAgentPermission />} />

            {/* Company and Partner Management */}
            <Route path="/companies" element={<CompaniesView />} />
            <Route path="/companies/create" element={<AddCompany />} />
            <Route path="/companies/:id/update" element={<UpdateCompany />} />

            {/* Customer Management */}
            <Route path="/customers" element={<CustomersView />} />
            <Route path="/customers/create" element={<AddCustomer />} />
            <Route path="/customers/:id/update" element={<UpdateCustomer />} />
            <Route path="/customers/chrono" element={<CustomerChrono />} />
            <Route path="/customers/families" element={<CustomerFamiliesView />} />
            <Route path="/customers/situations" element={<CustomersSituation />} />
   <Route path="/customers/categories" element={<CustomerCategoriesView />} />
            {/* Supplier Management */}
            <Route path="/suppliers" element={<SuppliersView />} />
            <Route path="/suppliers/create" element={<AddSupplier />} />
            <Route path="/suppliers/:id/update" element={<UpdateSupplier />} />
            <Route path="/suppliers/chrono" element={<SupplierChrono />} />
            <Route path="/suppliers/situations" element={<SuppliersSituation />} />

            {/* Product Management */}
            <Route path="/products" element={<ProductsView />} />
            <Route path="/products/create" element={<AddProduct />} />
            <Route path="/products/:id/update" element={<UpdateProduct />} />
            <Route path="/products/:id/chrono" element={<ProductChrono />} />
            <Route path="/products/pricings" element={<ProductPricing />} />
            <Route path="/products/warehouses" element={<ProductWarehouses />} />


            <Route path="/products/families" element={<ProductsFamiliesView />} />
            <Route path="/products/measuring-units" element={<ProductWarehouses />} />
            <Route path="/products/categories" element={<ProductsCategoriesView />} />
            <Route path="/products/marques" element={<ProductsMarquesView />} />
            <Route path="/products/vats" element={<ProductWarehouses />} />

            {/* Warehouse Management */}
            <Route path="/warehouses" element={<WarehousesView />} />
            <Route path="/warehouses/create" element={<AddWarehouse />} />
            <Route path="/warehouses/:id/update" element={<UpdateWarehouse />} />

            {/* Vehicle and Tour Management */}
            <Route path="/vehicles" element={<VehiclesView />} />
            <Route path="/vehicles/create" element={<AddVehicle />} />
            <Route path="/vehicles/:id/update" element={<UpdateVehicle />} />
            <Route path="/tours" element={<ToursView />} />
            <Route path="/tours/customers" element={<ToursCustomers />} />
            <Route path="/tours/create" element={<AddTour />} />
            <Route path="/tours/:id/update" element={<UpdateTour />} />

            {/* Financial Management */}
            <Route path="/transactions" element={
                <Transactions endpoint="/transactions" label="transaction" designation="nom" />
            } />
            <Route path="/transactions/transfer" element={<MoneyTransfer />} />
            <Route path="/transactions/collection" element={<AddCollection />} />
            <Route path="/transactions/collection/:id/update" element={<UpdateCollection />} />
            <Route path="/transactions/disbursement" element={<AddDisbursement />} />
            <Route path="/transactions/disbursement/:id/update" element={<UpdateDisbursement />} />
            <Route path="/money-boxes" element={<MoneyBoxesView />} />
            <Route path="/money-boxes/create" element={<AddingMoneyBox />} />
            <Route path="/money-box-sessions" element={<MoneyBoxSessions />} />

            {/* Document Management - Sales & Billing */}
            <Route path="/documents/sales" element={<SalesDocumentsView />} />
            <Route path="/documents/purchases" element={<PurchaseDocumentsView />} />
            <Route path="/documents/sales/billings" element={<SalesBillingDocumentsView />} />
            <Route path="/documents/purchases/billings" element={<PurchasesBillingDocumentsView />} />

            <Route path="/documents/bill/create" element={<AddBill />} />
            <Route path="/documents/bill/:id/update" element={<UpdateBill />} />
            <Route path="/documents/bill/:id" element={<UpdateBill disabled />} />

            <Route path="/documents/bill-supplier/create" element={<AddBillSupplier />} />
            <Route path="/documents/bill-supplier/:id/update" element={<UpdateBillSupplier />} />
            <Route path="/documents/bill-supplier/:id" element={<UpdateBillSupplier disabled />} />

            <Route path="/documents/bill-supplier-return/create" element={<AddBillSupplierReturn />} />
            <Route path="/documents/bill-supplier-return/:id/update" element={<UpdateBillSupplierReturn />} />
            <Route path="/documents/bill-supplier-return/:id" element={<UpdateBillSupplierReturn disabled />} />

            <Route path="/documents/bill-customer-return/create" element={<AddBillCustomerReturn />} />
            <Route path="/documents/bill-customer-return/:id/update" element={<UpdateBillCustomerReturn />} />
            <Route path="/documents/bill-customer-return/:id" element={<UpdateBillCustomerReturn disabled />} />

            {/* Document Management - Proforma & Commands */}
            <Route path="/documents/sales/proforma" element={<SalesProformaDocuments />} />
            <Route path="/documents/purchases/proforma" element={<PurchasesProformaDocuments />} />

            <Route path="/documents/proforma-customer/create" element={<AddProformaCustomer />} />
            <Route path="/documents/proforma-customer/:id" element={<UpdateProformaCustomer disabled />} />
            <Route path="/documents/proforma-customer/:id/update" element={<UpdateProformaCustomer />} />


            <Route path="/documents/proforma-supplier/create" element={<AddProformaSupplier />} />
            <Route path="/documents/proforma-supplier/:id" element={<UpdateProformaSupplier disabled />} />
            <Route path="/documents/proforma-supplier/:id/update" element={<UpdateProformaSupplier />} />


            <Route path="/documents/sales/commands" element={<SalesCommandsDocumentsView />} />
            <Route path="/documents/purchases/commands" element={<PurchasesCommandsDocumentsView />} />

            <Route path="/documents/command-customer/create" element={<AddCommandCustomer />} />
            <Route path="/documents/command-customer/:id" element={<UpdateCommandCustomer disabled />} />
            <Route path="/documents/command-customer/:id/update" element={<UpdateCommandCustomer />} />
            <Route path="/documents/command-supplier/:id" element={<UpdateCommandSupplier disabled />} />
            <Route path="/documents/command-supplier/create" element={<AddCommandSupplier />} />
            <Route path="/documents/command-supplier/:id/update" element={<UpdateCommandSupplier />} />

            {/* Document Management - Delivery & Reception */}
            <Route path="/documents/delivery/:id" element={<UpdateDelivery disabled />} />
            <Route path="/documents/delivery/create" element={<AddDelivery documentType={"livraison"} />} />
            <Route path="/documents/delivery/:id/update" element={<UpdateDelivery />} />
            <Route path="/documents/reception/:id" element={<UpdateReception disabled />} />
            <Route path="/documents/reception/create" element={<AddReception />} />
            <Route path="/documents/reception/:id/update" element={<UpdateReception />} />

            {/* Document Management - Returns */}
            <Route path="/documents/customer-return/:id" element={<UpdateReturnClient disabled />} />
            <Route path="/documents/customer-return/create" element={<AddReturnClient />} />
            <Route path="/documents/customer-return/:id/update" element={<UpdateReturnClient />} />
            <Route path="/documents/supplier-return/:id" element={<UpdateReturnSupplier disabled />} />
            <Route path="/documents/supplier-return/create" element={<AddReturnSupplier />} />
            <Route path="/documents/supplier-return/:id/update" element={<UpdateReturnSupplier />} />


            {/* Document Management - Stock & Inventory */}
            <Route path="/documents/missing-stock/create" element={<AddMissingStock />} />
            <Route path="/documents/missing-stock/:id/update" element={<UpdateMissingStock />} />
            <Route path="/documents/missing-stock/:id" element={<UpdateMissingStock disabled />} />
            <Route path="/documents/excess-stock/:id" element={<UpdateExcessStock disabled />} />
            <Route path="/documents/excess-stock/create" element={<AddExcessStock />} />
            <Route path="/documents/excess-stock/:id/update" element={<UpdateExcessStock />} />
            <Route path="/documents/regularization" element={<RegularizationDocumentsView />} />
            <Route path="/inventories" element={<InventoriesView />} />
            <Route path="/inventories/create" element={<AddInventory />} />
            <Route path="/inventories/:id/update" element={<UpdateInventory />} />

            {/* Document Management - Loading & Transfer */}
            <Route path="/documents/logistics" element={<LogisticDocumentsView />} />
            <Route path="/documents/loadings" element={<LoadingDocumentsView />} />
            <Route path="/documents/transfers" element={<TransferDocumentsView />} />
            <Route path="/documents/transfers/:reference" element={<UpdateProductTransfer disabled />} />
            <Route path="/documents/transfers/:reference/update" element={<UpdateProductTransfer />} />
            <Route path="/documents/transfers/create" element={<AddTransfer />} />

            <Route path="/documents/unloadings" element={<UnloadingDocumentsView />} />
            <Route path="/documents/van-loading" element={<VanLoadingView />} />
            <Route path="/documents/van-loading/:reference" element={<VanLoadingFastUpdate disabled />} />
            <Route path="/documents/van-loading/create" element={<AddVanLoadingFastCreate />} />
            <Route path="/documents/van-loading/:reference/update" element={<VanLoadingFastUpdate />} />
            <Route path="/documents/van-unloading/:reference/update" element={<UpdateVanUnloading />} />
            <Route path="/documents/van-unloading" element={<VanUnloadingView />} />
            <Route path="/documents/van-unloading/create" element={<AddVanUnLoading />} />
            <Route path="/documents/van-unloading/:reference" element={<UpdateVanUnloading disabled />} />
            <Route path="/documents/van-loading/create/quick" element={<AddVanLoadingFastCreate />} />
            <Route path="/documents/van-loading-demands" element={<LoadingDemandDocuments />} />
            <Route path="/documents/van-loading-demands/create" element={<AddVanLoadingDemand />} />
            <Route path="/documents/van-loading-demands/:id/update" element={<UpdateVanLoadingDemand />} />
            <Route path="/documents/van-loading-demands/:id" element={<UpdateVanLoadingDemand disabled />} />


            <Route path="/charts" element={<OrganizationalChart />} />




            {/* Miscellaneous Features */}
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/documents/transformations" element={<DocumentTransformationsView />} />
            <Route path="/documents/transformations/create" element={<AddDocumentTransformation />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/routes" element={<RoutesView />} />
            <Route path="/routes/create" element={<AddRoute />} />
            <Route path="/routes/:id/update" element={<UpdateRoute />} />
            <Route path="/batches" element={<BatchView />} />
            <Route path="/batches/create" element={<AddBatch />} />
            <Route path="/batches/update" element={<UpdateBatch />} />
            <Route path="/promotions" element={<PromotionView />} />
            <Route path="/promotions/:id" element={<PromotionDetails />} />
            <Route path="/promotions/create" element={<AddPromotion />} />
            <Route path="/promotions/:id/update" element={<UpdatePromotion />} />
            <Route path="/quota" element={<Quota />} />
            <Route path="/missions" element={<MissionsView />} />
            <Route path="/missions/create" element={<AddMission />} />
            <Route path="/missions/:id" element={<MissionDetails />} />
            <Route path="/missions/:id/update" element={<UpdateMission />} />
            <Route path="/mobile/presentation" element={<MobilePresentation />} />
            <Route path="/currencies" element={<CurrenciesView />} />
            <Route path="/activities" element={<ActivitiesView />} />
            <Route path="/vats" element={<VatsView />} />
            <Route path="/legal-forms" element={<LegalFormsView />} />

            <Route path="/bankingstatus" element={<BankingStatusView />} />
            
             {/* Audit Management */}
             <Route path="/audits-product-creation" element={<AuditTrailProductCreation />} />

             <Route path="/audits-document-deletion" element={<AuditeDocumentsDelete />} />
             <Route path="/audits-document-creation" element={<AuditeDocumentsCreate />} />
             <Route path="/audits-document-update" element={<AuditeDocumentsUpdate />} />





        </Routes>
    )
}

export default AppRoutes