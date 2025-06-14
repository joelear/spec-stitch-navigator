import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, ExternalLink, MessageCircle } from "lucide-react";

const companies = [
  {
    id: 1,
    name: "Attio",
    logo: null,
    categories: ["Automation", "B2B", "Enterprise", "Information"],
    website: "attio",
    linkedin: "No contact",
    connection: "No communication",
    followers: null
  },
  {
    id: 2,
    name: "Disney",
    logo: null,
    categories: ["B2C", "Entertainment & Recreation"],
    website: "the-walt-disney-com...",
    linkedin: "No contact", 
    connection: "No communication",
    followers: "10,148"
  },
  {
    id: 3,
    name: "Microsoft",
    logo: null,
    categories: ["B2B", "Enterprise", "Information", "Publishing"],
    website: "microsoft",
    linkedin: "No contact",
    connection: "No communication", 
    followers: "12,839"
  },
  {
    id: 4,
    name: "Google", 
    logo: null,
    categories: ["B2B", "B2C", "Broadcasting", "Information"],
    website: "google",
    linkedin: "No contact",
    connection: "No communication",
    followers: "28,945"
  },
  {
    id: 5,
    name: "United Airlines",
    logo: null,
    categories: ["Airlines", "B2C", "E-commerce", "Transport"],
    website: "united-airlines",
    linkedin: "No contact",
    connection: "No communication", 
    followers: "1,175"
  },
  {
    id: 6,
    name: "LVMH",
    logo: null,
    categories: ["B2C", "Consumer Discretionary", "E-commerce"],
    website: "lvmh",
    linkedin: "No contact",
    connection: "No communication",
    followers: "198"
  },
  {
    id: 7,
    name: "Intercom",
    logo: null,
    categories: ["B2B", "Information", "Publishing", "SAAS"],
    website: "intercom",
    linkedin: "No contact",
    connection: "No communication",
    followers: "4"
  },
  {
    id: 8,
    name: "PayPal",
    logo: null,
    categories: ["B2C", "Finance", "Financial Services", "Information"],
    website: "paypal",
    linkedin: "No contact",
    connection: "No communication",
    followers: "908"
  },
  {
    id: 9,
    name: "Airbnb",
    logo: null,
    categories: ["B2C", "Information", "Internet", "Marketplace"],
    website: "airbnb", 
    linkedin: "No contact",
    connection: "No communication",
    followers: "880"
  },
  {
    id: 10,
    name: "Apple",
    logo: null,
    categories: ["B2C", "Computer Hardware", "Consumer Electronics", "Consumer"],
    website: "apple",
    linkedin: "No contact",
    connection: "No communication",
    followers: "9,175"
  }
];

const getCategoryColorClass = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('b2b')) return 'category-pill b2b';
  if (lowerCategory.includes('b2c')) return 'category-pill b2c'; 
  if (lowerCategory.includes('saas')) return 'category-pill saas';
  if (lowerCategory.includes('enterprise')) return 'category-pill enterprise';
  if (lowerCategory.includes('finance')) return 'category-pill finance';
  return 'category-pill bg-gray-100 text-gray-700';
};

export function CompaniesTable() {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <Table className="attio-table">
        <TableHeader className="attio-table-header">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="w-12 attio-table-header-cell">
              <Checkbox />
            </TableHead>
            <TableHead className="attio-table-header-cell">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Company</span>
              </div>
            </TableHead>
            <TableHead className="attio-table-header-cell">
              <span>Categories</span>
            </TableHead>
            <TableHead className="attio-table-header-cell">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span>LinkedIn</span>
              </div>
            </TableHead>
            <TableHead className="attio-table-header-cell">
              <span>Last interaction</span>
            </TableHead>
            <TableHead className="attio-table-header-cell">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Connection strength</span>
              </div>
            </TableHead>
            <TableHead className="attio-table-header-cell text-right">
              <span>Twitter followers</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id} className="attio-table-row">
              <TableCell className="attio-table-cell">
                <Checkbox />
              </TableCell>
              <TableCell className="attio-table-cell">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="font-medium">{company.name}</span>
                </div>
              </TableCell>
              <TableCell className="attio-table-cell">
                <div className="flex flex-wrap gap-1">
                  {company.categories.map((category) => (
                    <span key={category} className={getCategoryColorClass(category)}>
                      {category}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="attio-table-cell">
                {company.website !== "No contact" ? (
                  <a href="#" className="text-primary hover:underline">
                    {company.website}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{company.linkedin}</span>
                )}
              </TableCell>
              <TableCell className="attio-table-cell">
                <span className="text-muted-foreground">{company.linkedin}</span>
              </TableCell>
              <TableCell className="attio-table-cell">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span className="text-muted-foreground">{company.connection}</span>
                </div>
              </TableCell>
              <TableCell className="attio-table-cell text-right">
                {company.followers && (
                  <span className="font-mono text-sm">{company.followers}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background">
        <span className="text-sm text-muted-foreground">10 count</span>
        <div className="flex gap-4">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            + Add calculation
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            + Add calculation
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            + Add calculation
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            + Add calculation
          </button>
        </div>
      </div>
    </div>
  );
}