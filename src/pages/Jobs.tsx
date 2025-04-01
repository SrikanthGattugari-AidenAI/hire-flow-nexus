
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, Search, X } from "lucide-react";
import { jobs, departments, locations, jobStatuses } from "@/data/mockData";
import { format } from "date-fns";

interface Job {
  id: number;
  title: string;
  department: { id: number; name: string };
  location: { id: number; name: string };
  status: { id: number; name: string; color: string };
  postedDate: string;
  applications: number;
}

const Jobs = () => {
  const [jobsList, setJobsList] = useState<Job[]>(jobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    departmentId: "",
    locationId: "",
    statusId: "1", // Default to 'Open'
    description: "",
    requirements: "",
    benefits: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  
  const { toast } = useToast();

  const filteredJobs = jobsList.filter((job) => {
    let matches = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (departmentFilter && job.department.id.toString() !== departmentFilter) {
      matches = false;
    }
    
    if (locationFilter && job.location.id.toString() !== locationFilter) {
      matches = false;
    }
    
    if (statusFilter && job.status.id.toString() !== statusFilter) {
      matches = false;
    }
    
    return matches;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("");
    setLocationFilter("");
    setStatusFilter("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
    if (!newJob.title || !newJob.departmentId || !newJob.locationId || !newJob.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we'd send this to an API
    const selectedDepartment = departments.find(
      (dept) => dept.id.toString() === newJob.departmentId
    );
    const selectedLocation = locations.find(
      (loc) => loc.id.toString() === newJob.locationId
    );
    const selectedStatus = jobStatuses.find(
      (status) => status.id.toString() === newJob.statusId
    );
    
    if (!selectedDepartment || !selectedLocation || !selectedStatus) {
      toast({
        title: "Invalid selection",
        description: "Please check your selections and try again.",
        variant: "destructive",
      });
      return;
    }
    
    const newJobEntry = {
      id: jobsList.length + 1,
      title: newJob.title,
      department: selectedDepartment,
      location: selectedLocation,
      status: selectedStatus,
      postedDate: format(new Date(), "yyyy-MM-dd"),
      applications: 0,
    };
    
    setJobsList([newJobEntry, ...jobsList]);
    setIsOpen(false);
    
    // Reset the form
    setNewJob({
      title: "",
      departmentId: "",
      locationId: "",
      statusId: "1",
      description: "",
      requirements: "",
      benefits: "",
    });
    
    toast({
      title: "Job created",
      description: "The job has been successfully created.",
    });
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
                <DialogDescription>
                  Fill out the form below to create a new job posting.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                    <Select
                      value={newJob.departmentId}
                      onValueChange={(val) => setNewJob({ ...newJob, departmentId: val })}
                      required
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                    <Select
                      value={newJob.locationId}
                      onValueChange={(val) => setNewJob({ ...newJob, locationId: val })}
                      required
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                  <Select
                    value={newJob.statusId}
                    onValueChange={(val) => setNewJob({ ...newJob, statusId: val })}
                    required
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobStatuses.map((status) => (
                        <SelectItem key={status.id} value={status.id.toString()}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Enter job description..."
                    rows={5}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Enter job requirements..."
                    rows={3}
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    placeholder="Enter job benefits..."
                    rows={3}
                    value={newJob.benefits}
                    onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Job</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(departmentFilter || locationFilter || statusFilter) && (
                <Badge className="ml-1 bg-primary hover:bg-primary-700">
                  {(departmentFilter ? 1 : 0) + (locationFilter ? 1 : 0) + (statusFilter ? 1 : 0)}
                </Badge>
              )}
            </Button>
            
            {(departmentFilter || locationFilter || statusFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Clear Filters
              </Button>
            )}
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filter-department">Department</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger id="filter-department">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filter-location">Location</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger id="filter-location">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filter-status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="filter-status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {jobStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
            {searchQuery || departmentFilter || locationFilter || statusFilter
              ? "matching filters"
              : "total"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department.name}</TableCell>
                      <TableCell>{job.location.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {job.applications}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={job.status.color}>
                          {job.status.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.postedDate}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No jobs found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredJobs.length} of {jobsList.length} jobs
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Jobs;
