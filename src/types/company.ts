export interface Company {
  id: string;
  name: string;
  logo: string;
  numberOfEvents: number;
  status: "active" | "inactive" | "pending";
  industry: string;
  location: string;
  lastEventDate: string;
}

export interface CompanyTableProps {
  companies: Company[];
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
  onView?: (company: Company) => void;
}
