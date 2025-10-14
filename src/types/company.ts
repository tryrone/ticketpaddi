export interface Company {
  id: string;
  name: string;
  logo?: string;
  numberOfEvents?: number;
  status?: "active" | "inactive" | "pending";
  location?: string;
  lastEventDate?: string;
  description?: string;
  userId: string;
}

export interface CompanyTableProps {
  companies: Company[];
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
  onView?: (company: Company) => void;
  onAddCompany?: () => void;
  loading?: boolean;
}
